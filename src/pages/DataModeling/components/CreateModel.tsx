import React, { useState, useCallback } from 'react';
import { Button, Drawer, Form, Input, Table, Popconfirm, Tag, Modal, message } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { FieldInitialValues, Model } from './types';
import FieldForm from "./FieldForm.tsx";
import IndexForm from "./IndexForm.tsx";

interface Props {
  datasource: string;
  onConform: (model: Model) => void;
  onCancel: () => void;
}

const CreateModel: React.FC<Props> = ({ datasource, onConform, onCancel }) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [changeFieldDialogVisible, setChangeFieldDialogVisible] = useState<boolean>(false);
  const [changeIndexDialogVisible, setChangeIndexDialogVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number>(-1);
  const [selectedIndexIndex, setSelectedIndexIndex] = useState<number>(-1);
  const [fieldForm, setFieldForm] = useState<any>(FieldInitialValues['string']);
  const [indexForm, setIndexForm] = useState<any>({});

  const [model, setModel] = useState<Model>({
    name: '',
    comment: '',
    fields: [
      {
        name: 'id',
        type: 'id',
        unique: true,
        nullable: false,
        generatedValue: 'AUTO_INCREMENT',
        comment: 'ID',
      }
    ],
    indexes: []
  });

  const handleAddField = () => {
    setFieldForm(FieldInitialValues['string']);
    setSelectedFieldIndex(-1);
    setChangeFieldDialogVisible(true);
  };

  const handleEditField = (index: number) => {
    setFieldForm(model.fields[index]);
    setSelectedFieldIndex(index);
    setChangeFieldDialogVisible(true);
  };

  const handleCancelFieldForm = () => {
    setFieldForm(FieldInitialValues['string']);
    setChangeFieldDialogVisible(false);
  };

  const addOrEditField = (val: any) => {
    const newFields = [...model.fields];
    if (selectedFieldIndex === -1) {
      newFields.push(val);
    } else {
      newFields[selectedFieldIndex] = val;
    }
    setModel({ ...model, fields: newFields });
    setChangeFieldDialogVisible(false);
  };

  const handleDeleteField = (index: number) => {
    const newFields = model.fields.filter((_, i) => i !== index);
    setModel({ ...model, fields: newFields });
  };

  const handleAddIndex = () => {
    setIndexForm({});
    setSelectedIndexIndex(-1);
    setChangeIndexDialogVisible(true);
  };

  const handleEditIndex = (index: number) => {
    setIndexForm(model.indexes[index]);
    setSelectedIndexIndex(index);
    setChangeIndexDialogVisible(true);
  };

  const addOrEditIndex = (val: any) => {
    const newIndexes = [...model.indexes];
    if (selectedIndexIndex === -1) {
      newIndexes.push(val);
    } else {
      newIndexes[selectedIndexIndex] = val;
    }
    setModel({ ...model, indexes: newIndexes });
    setChangeIndexDialogVisible(false);
  };

  const handleDeleteIndex = (index: number) => {
    const newIndexes = model.indexes.filter((_, i) => i !== index);
    setModel({ ...model, indexes: newIndexes });
  };

  const handleSubmit = () => {
    onConform(model);
    setDrawerVisible(false);
  };

  const handleCancel = () => {
    onCancel();
    setDrawerVisible(false);
  };

  const fieldColumns: ColumnsType<any> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (text) => text },
    { title: 'Unique', dataIndex: 'unique', key: 'unique' },
    { title: 'Nullable', dataIndex: 'nullable', key: 'nullable' },
    { title: 'Comment', dataIndex: 'comment', key: 'comment' },
    {
      title: 'Operations',
      key: 'operations',
      render: (_, __, index) => (
        <>
          <Button type="primary" onClick={() => handleEditField(index)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this?" onConfirm={() => handleDeleteField(index)}>
            <Button type="primary" danger style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  const indexColumns: ColumnsType<any> = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Fields',
      key: 'fields',
      render: (text) => (
        <div className="flex gap-1">
          {text.map((item: any) => (
            <Tag color="blue" key={item.fieldName}>
              {item.fieldName} {item.direction}
            </Tag>
          ))}
        </div>
      )
    },
    { title: 'Unique', dataIndex: 'unique', key: 'unique' },
    {
      title: 'Operations',
      key: 'operations',
      render: (_, __, index) => (
        <>
          <Button type="primary" onClick={() => handleEditIndex(index)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this?" onConfirm={() => handleDeleteIndex(index)}>
            <Button type="primary" danger style={{ marginLeft: 8 }}>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <Drawer
        title="Create Model"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        width="50%"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Comment" name="comment">
            <Input />
          </Form.Item>
          <Form.Item label="Fields">
            <Table
              columns={fieldColumns}
              dataSource={model.fields}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" style={{ width: '100%' }} onClick={handleAddField}>Add Field</Button>
              )}
            />
          </Form.Item>
          <Form.Item label="Indexes">
            <Table
              columns={indexColumns}
              dataSource={model.indexes}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" style={{ width: '100%' }} onClick={handleAddIndex}>Add Index</Button>
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={handleSubmit}>Create</Button>
          </Form.Item>
        </Form>
      </Drawer>
      <FieldForm
        visible={changeFieldDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={fieldForm}
        onConfirm={addOrEditField}
        onCancel={() => setChangeFieldDialogVisible(false)}
      />
      <IndexForm
        visible={changeIndexDialogVisible}
        datasource={datasource}
        model={model}
        currentValue={indexForm}
        onConfirm={addOrEditIndex}
        onCancel={() => setChangeIndexDialogVisible(false)}
      />
    </>
  );
};

export default CreateModel;
