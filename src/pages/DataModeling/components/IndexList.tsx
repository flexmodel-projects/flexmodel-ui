import React, {useCallback, useEffect, useState} from 'react';
import {Button, Card, notification, Popconfirm, Space, Table, Tag} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {createIndex, dropIndex, modifyIndex} from '@/services/model.ts';
import IndexForm from "./IndexForm.tsx";
import {Entity, Index} from "@/types/data-modeling";
import {useTranslation} from "react-i18next";

interface IndexListProps {
  datasource: string;
  model: Entity;
}

const IndexList: React.FC<IndexListProps> = ({datasource, model}) => {
  const {t} = useTranslation();
  const [indexList, setIndexList] = useState<Index[]>([]);
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>(false);
  const [selectedIndexKey, setSelectedIndexKey] = useState<number>(-1);
  const [currentVal, setCurrentVal] = useState<Index>({name: '', fields: [], unique: false});

  const fetchIndexes = useCallback(async () => {
    // Replace this with actual fetch call
    // const res = await getIndexes(datasource, model?.name);
    setIndexList(model?.indexes || []);
  }, [datasource, model?.name]);

  useEffect(() => {
    fetchIndexes();
  }, [fetchIndexes]);

  const handleNewIndex = () => {
    setChangeDialogVisible(true);
    setSelectedIndexKey(-1);
    setCurrentVal({name: '', fields: [], unique: false});
  };

  const handleEdit = (index: number) => {
    setSelectedIndexKey(index);
    setCurrentVal(indexList[index]);
    setChangeDialogVisible(true);
  };

  const addOrEditIndex = async (values: Index) => {
    try {
      const indexSchema = {
        name: values.name,
        fields: values.fields.map((f: any) => ({
          fieldName: f.fieldName,
          direction: f.direction,
          name: f.fieldName,
          type: '', // 需根据实际情况填写
          concreteType: '',
          unique: false,
          nullable: false,
          comment: '',
        })),
        unique: values.unique,
        modelName: model?.name,
      };
      if (selectedIndexKey === -1) {
        await createIndex(datasource, model?.name as string, indexSchema);
        setIndexList([...indexList, values]);
      } else {
        await modifyIndex(datasource, model?.name as string, values.name, indexSchema);
        const updatedIndexes = [...indexList];
        updatedIndexes[selectedIndexKey] = values;
        setIndexList(updatedIndexes);
      }
      setChangeDialogVisible(false);
      notification.success({message: 'Index saved successfully'});
    } catch (error) {
      console.error(error);
      notification.error({message: 'Failed to save index'});
    }
  };

  const delIndex = async (key: number) => {
    try {
      const index = indexList[key];
      await dropIndex(datasource, model?.name as string, index.name);
      setIndexList(indexList.filter((_, i) => i !== key));
      notification.success({message: 'Index deleted successfully'});
    } catch (error) {
      console.error(error);
      notification.error({message: 'Failed to delete index'});
    }
  };

  const columns = [
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {
      title: t('fields'),
      dataIndex: 'fields',
      key: 'fields',
      render: (fields: { fieldName: string; direction: string }[]) => (
        <Space>
          {fields.map((field, index) => (
            <Tag key={index} color="default">
              {field.fieldName} {field.direction}
            </Tag>
          ))}
        </Space>
      ),
    },
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')},
    {
      title: t('operations'),
      key: 'operations',
      render: (_: any, _record: Index, index: number) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined/>}
            onClick={() => handleEdit(index)}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            title={t('table_selection_delete_text')}
            onConfirm={() => delIndex(index)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined/>}
            >
              {t('delete')}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card size="small" bodyStyle={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleNewIndex}
          size="small"
        >
          {t('new_index')}
        </Button>
      </div>
      <Table
        rowKey="name"
        dataSource={indexList}
        columns={columns}
        pagination={false}
      />
      <IndexForm
        visible={changeDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={currentVal}
        onConfirm={addOrEditIndex}
        onCancel={() => setChangeDialogVisible(false)}
      />
    </Card>
  );
};

export default IndexList;

