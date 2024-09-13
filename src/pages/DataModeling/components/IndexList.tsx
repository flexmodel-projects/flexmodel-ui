import React, {useCallback, useEffect, useState} from 'react';
import {Button, notification, Popconfirm, Table, Tag} from 'antd';
import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {createIndex, dropIndex, modifyIndex} from '../../../api/model';
import IndexForm from "./IndexForm";

interface Model {
  name?: string;
  comment?: string;
  indexes: Index[];
}

interface Index {
  name: string;
  fields: { fieldName: string; direction: string }[];
  unique: boolean;
}

interface MyComponentProps {
  datasource: string;
  model: Model;
}

const IndexList: React.FC<MyComponentProps> = ({datasource, model}) => {
  const [indexList, setIndexList] = useState<Index[]>([]);
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>(false);
  const [selectedIndexKey, setSelectedIndexKey] = useState<number>(-1);
  const [currentVal, setCurrentVal] = useState<Index>(null);

  const fetchIndexes = useCallback(async () => {
    // Replace this with actual fetch call
    // const res = await getIndexes(datasource, model?.name);
    setIndexList(model.indexes);
  }, [datasource, model?.name]);

  useEffect(() => {
    fetchIndexes();
  }, [fetchIndexes]);

  const handleAdd = () => {
    setChangeDialogVisible(true);
    setSelectedIndexKey(-1);
  };

  const handleEdit = (index: number) => {
    setSelectedIndexKey(index);
    setCurrentVal(indexList[index]);
    setChangeDialogVisible(true);
  };

  const addOrEditIndex = async (values: Index) => {
    try {
      if (selectedIndexKey === -1) {
        await createIndex(datasource, model?.name, values);
        setIndexList([...indexList, values]);
      } else {
        await modifyIndex(datasource, model?.name, values.name, values);
        const updatedIndexes = [...indexList];
        updatedIndexes[selectedIndexKey] = values;
        setIndexList(updatedIndexes);
      }
      setChangeDialogVisible(false);
      notification.success({message: 'Index saved successfully'});
    } catch (error) {
      notification.error({message: 'Failed to save index'});
    }
  };

  const delIndex = async (key: number) => {
    try {
      const index = indexList[key];
      await dropIndex(datasource, model?.name, index.name);
      setIndexList(indexList.filter((_, i) => i !== key));
      notification.success({message: 'Index deleted successfully'});
    } catch (error) {
      notification.error({message: 'Failed to delete index'});
    }
  };

  const columns = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {
      title: 'Fields',
      dataIndex: 'fields',
      key: 'fields',
      render: (fields: { fieldName: string; direction: string }[]) => (
        <div>
          {fields.map((field, index) => (
            <Tag key={index} color="default">
              {field.fieldName} {field.direction}
            </Tag>
          ))}
        </div>
      ),
    },
    {title: 'Unique', dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')},
    {
      title: 'Operations',
      key: 'operations',
      render: (_: any, record: Index, index: number) => (
        <div>
          <Button
            type="link"
            icon={<EditOutlined/>}
            onClick={() => handleEdit(index)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this index?"
            onConfirm={() => delIndex(index)}
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined/>}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{padding: '20px'}}>
      <div>
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <div>
            {model?.name} {model?.comment}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined/>}
            onClick={handleAdd}
          >
            New Index
          </Button>
        </div>
      </div>
      <div style={{marginTop: 16}}>
        <Table
          size="small"
          rowKey="name"
          dataSource={indexList}
          columns={columns}
          pagination={false}
        />
      </div>
      <IndexForm
        visible={changeDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={currentVal}
        onConfirm={addOrEditIndex}
        onCancel={() => setChangeDialogVisible(false)}/>
    </div>
  );
};

export default IndexList;
