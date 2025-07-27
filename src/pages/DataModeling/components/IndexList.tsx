import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Popconfirm, Table, Tag, theme} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {createIndex, dropIndex, modifyIndex} from '../../../services/model.ts';
import IndexForm from "./IndexForm.tsx";
import {Entity, Index} from "@/types/data-modeling";
import {useTranslation} from "react-i18next";


interface IndexListProps {
  datasource: string;
  model: Entity;
}

const IndexList: React.FC<IndexListProps> = ({datasource, model}) => {
  const {t} = useTranslation();
  const { token } = theme.useToken();
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
        <div>
          {fields.map((field, index) => (
            <Tag key={index} color="default" style={{fontSize: token.fontSizeSM}}>
              {field.fieldName} {field.direction}
            </Tag>
          ))}
        </div>
      ),
    },
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')},
    {
      title: t('operations'),
      key: 'operations',
      render: (_: any, _record: Index, index: number) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined/>}
            onClick={() => handleEdit(index)}
            size="small"
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
              size="small"
            >
              {t('delete')}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // 紧凑主题样式
  const containerStyle = {
    
    padding: token.paddingSM,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: ` ${token.colorBorder}`,
  };

  const headerStyle = {
    
    justifyContent: 'space-between',
  };

  const tableStyle = {
    
    marginTop: token.marginSM,
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div></div>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={handleNewIndex}
          size="small"
        >
          {t('new_index')}
        </Button>
      </div>
      <div style={{marginTop: token.marginSM}}>
        <Table
          size="small"
          rowKey="name"
          dataSource={indexList}
          columns={columns}
          pagination={false}
          style={tableStyle}
        />
      </div>
      <IndexForm
        visible={changeDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={currentVal}
        onConfirm={addOrEditIndex}
        onCancel={() => setChangeDialogVisible(false)}
      />
    </div>
  );
};

export default IndexList;

