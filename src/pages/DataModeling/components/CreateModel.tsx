import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, Popconfirm, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/es/table';
import {FieldInitialValues, Model} from './types';
import FieldForm from "./FieldForm.tsx";
import IndexForm from "./IndexForm.tsx";
import {PlusOutlined} from "@ant-design/icons";

interface Props {
  datasource: string;
  onConform: (model: Model) => void;
  onCancel: () => void;
  visible: boolean;
}

const CreateModel: React.FC<Props> = ({visible, datasource, onConform, onCancel}) => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [changeFieldDialogVisible, setChangeFieldDialogVisible] = useState<boolean>(false);
  const [changeIndexDialogVisible, setChangeIndexDialogVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number>(-1);
  const [selectedIndexIndex, setSelectedIndexIndex] = useState<number>(-1);
  const [fieldForm, setFieldForm] = useState<any>(FieldInitialValues['string']);
  const [indexForm, setIndexForm] = useState<any>({});

  useEffect(() => {
    setDrawerVisible(visible);
  }, [visible]);

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

  const addOrEditField = (val: any) => {
    const newFields = [...model.fields];
    if (selectedFieldIndex === -1) {
      newFields.push(val);
    } else {
      newFields[selectedFieldIndex] = val;
    }
    setModel({...model, fields: newFields});
    setChangeFieldDialogVisible(false);
  };

  const handleDeleteField = (index: number) => {
    const newFields = model.fields.filter((_, i) => i !== index);
    setModel({...model, fields: newFields});
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
    setModel({...model, indexes: newIndexes});
    setChangeIndexDialogVisible(false);
  };

  const handleDeleteIndex = (index: number) => {
    const newIndexes = model.indexes.filter((_, i) => i !== index);
    setModel({...model, indexes: newIndexes});
  };

  const fieldColumns: ColumnsType<any> = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {title: 'Type', dataIndex: 'type', key: 'type', render: (text) => text},
    {title: 'Unique', dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')},
    {
      title: 'Nullable',
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => (nullable ? 'Yes' : 'No')
    },
    {title: 'Comment', dataIndex: 'comment', key: 'comment'},
    {
      title: 'Operations',
      key: 'operations',
      render: (_, __, index) => (
        <>
          <Button type="link" onClick={() => handleEditField(index)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this?" onConfirm={() => handleDeleteField(index)}>
            <Button type="link" danger style={{marginLeft: 8}}>Delete</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  const indexColumns: ColumnsType<any> = [
    {title: 'Name', dataIndex: 'name', key: 'name'},
    {
      title: 'Fields',
      key: 'fields',
      render: (text) => (
        <div className="flex gap-1">
          {text?.fields?.map((item: any) => (
            <Tag color="blue" key={item.fieldName}>
              {item.fieldName} {item.direction}
            </Tag>
          ))}
        </div>
      )
    },
    {title: 'Unique', dataIndex: 'unique', key: 'unique', render: (unique) => unique ? 'Yes' : 'No'},
    {
      title: 'Operations',
      key: 'operations',
      render: (_, __, index) => (
        <>
          <Button type="link" size="small" onClick={() => handleEditIndex(index)}>Edit</Button>
          <Popconfirm title="Are you sure to delete this?" onConfirm={() => handleDeleteIndex(index)}>
            <Button type="link" size="small" danger style={{marginLeft: 8}}>Delete</Button>
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
        onClose={() => {
          setDrawerVisible(false);
          onCancel();
        }}
        open={drawerVisible}
        width="50%"
        footer={
          <div style={{textAlign: 'right'}}>
            <Button onClick={() => {
              setDrawerVisible(false);
              onCancel();
            }} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button onClick={() => {
              form.setFieldValue('fields', model.fields);
              form.setFieldValue('indexes', model.indexes);
              onConform(form.getFieldsValue(true));
            }} type="primary">
              Conform
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{required: true, message: 'Please input the name!'}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Comment" name="comment">
            <Input/>
          </Form.Item>
          <Form.Item label="Fields">
            <Table
              size="small"
              columns={fieldColumns}
              dataSource={model.fields}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddField} ghost>Add
                  Field</Button>
              )}
            />
          </Form.Item>
          <Form.Item label="Indexes">
            <Table
              size="small"
              columns={indexColumns}
              dataSource={model.indexes}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddIndex} ghost>Add
                  Index</Button>
              )}
            />
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
