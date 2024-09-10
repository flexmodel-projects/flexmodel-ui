import React, { useState, useEffect, useCallback } from 'react';
import { Button, Card, Table, Modal, Popconfirm, Tag, Form, Input, notification } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { createIndex, dropIndex, modifyIndex } from '../../../api/model';

interface Model {
  name?: string;
  comment?: string;
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

const IndexList: React.FC<MyComponentProps> = ({ datasource, model }) => {
  const [indexList, setIndexList] = useState<Index[]>([]);
  const [changeDialogVisible, setChangeDialogVisible] = useState<boolean>(false);
  const [selectedIndexKey, setSelectedIndexKey] = useState<number>(-1);
  const [selectedIndexForm] = useState<Index>({ name: '', fields: [], unique: false });
  const [form] = Form.useForm();

  const fetchIndexes = useCallback(async () => {
    // Replace this with actual fetch call
    // const res = await getIndexes(datasource, model?.name);
    // setIndexList(res);
  }, [datasource, model?.name]);

  useEffect(() => {
    fetchIndexes();
  }, [fetchIndexes]);

  const handleAdd = () => {
    setChangeDialogVisible(true);
    setSelectedIndexKey(-1);
    form.resetFields();
  };

  const handleEdit = (index: number) => {
    setSelectedIndexKey(index);
    form.setFieldsValue(indexList[index]);
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
      notification.success({ message: 'Index saved successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to save index' });
    }
  };

  const delIndex = async (key: number) => {
    try {
      const index = indexList[key];
      await dropIndex(datasource, model?.name, index.name);
      setIndexList(indexList.filter((_, i) => i !== key));
      notification.success({ message: 'Index deleted successfully' });
    } catch (error) {
      notification.error({ message: 'Failed to delete index' });
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Fields',
      dataIndex: 'fields',
      key: 'fields',
      render: (fields: { fieldName: string; direction: string }[]) => (
        <div>
          {fields.map((field, index) => (
            <Tag key={index} color="info">
              {field.fieldName} {field.direction}
            </Tag>
          ))}
        </div>
      ),
    },
    { title: 'Unique', dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No') },
    {
      title: 'Operations',
      key: 'operations',
      render: (_: any, record: Index, index: number) => (
        <div>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(index)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this index?"
            onConfirm={() => delIndex(index)}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
            >
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            {model?.name} {model?.comment}
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            New Index
          </Button>
        </div>
      </Card>
      <Card style={{ marginTop: 16 }}>
        <Table
          rowKey="name"
          dataSource={indexList}
          columns={columns}
          pagination={false}
        />
      </Card>
      <Modal
        title={selectedIndexKey === -1 ? 'New Index' : 'Edit Index'}
        visible={changeDialogVisible}
        onCancel={() => setChangeDialogVisible(false)}
        onOk={() => form
          .validateFields()
          .then(values => addOrEditIndex(values))
          .catch(info => {
            console.log('Validate Failed:', info);
          })}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ ...selectedIndexForm }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input the index name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="fields"
            label="Fields"
            rules={[{ required: true, message: 'Please input the index fields!' }]}
          >
            {/* Customize this field according to your needs */}
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="unique"
            valuePropName="checked"
          >
            <Input type="checkbox" /> Unique
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default IndexList;
