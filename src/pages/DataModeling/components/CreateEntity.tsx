import React, {useEffect, useState} from 'react';
import {Button, Drawer, Form, Input, Popconfirm, Table, Tag} from 'antd';
import {ColumnsType} from 'antd/es/table';
import FieldForm from "./FieldForm.tsx";
import IndexForm from "./IndexForm.tsx";
import {PlusOutlined} from "@ant-design/icons";
import type {Model} from "../data.d.ts";
import {FieldInitialValues} from "../common.ts";
import {useTranslation} from "react-i18next";

interface Props {
  datasource: string;
  onConfirm: (model: Model) => void;
  onCancel: () => void;
  visible: boolean;
}

const CreateEntity: React.FC<Props> = ({visible, datasource, onConfirm, onCancel}) => {
  const {t} = useTranslation();

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
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {title: t('type'), dataIndex: 'type', key: 'type', render: (text) => text},
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (unique: boolean) => (unique ? 'Yes' : 'No')},
    {
      title: t('nullable'),
      dataIndex: 'nullable',
      key: 'nullable',
      render: (nullable: boolean) => (nullable ? 'Yes' : 'No')
    },
    {title: t('comment'), dataIndex: 'comment', key: 'comment'},
    {
      title: t('operations'),
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
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {
      title: t('fields'),
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
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (unique) => unique ? 'Yes' : 'No'},
    {
      title: t('operations'),
      key: 'operations',
      render: (_, __, index) => (
        <>
          <Button type="link" size="small" onClick={() => handleEditIndex(index)}>{t('edit')}</Button>
          <Popconfirm title={t('table_selection_delete_text')} onConfirm={() => handleDeleteIndex(index)}>
            <Button type="link" size="small" danger style={{marginLeft: 8}}>{t('delete')}</Button>
          </Popconfirm>
        </>
      )
    }
  ];

  return (
    <>
      <Drawer
        title={t('new_entity')}
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
              {t('cancel')}
            </Button>
            <Button onClick={() => {
              form.setFieldValue('fields', model.fields);
              form.setFieldValue('indexes', model.indexes);
              onConfirm(form.getFieldsValue(true));
            }} type="primary">
              {t('conform')}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item label={t('name')} name="name" rules={[{required: true, message: 'Please input the name!'}]}>
            <Input/>
          </Form.Item>
          <Form.Item label={t('comment')} name="comment">
            <Input/>
          </Form.Item>
          <Form.Item label={t('fields')}>
            <Table
              size="small"
              columns={fieldColumns}
              dataSource={model.fields}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddField} ghost>
                  {t('new_field')}
                </Button>
              )}
            />
          </Form.Item>
          <Form.Item label={t('indexes')}>
            <Table
              size="small"
              columns={indexColumns}
              dataSource={model.indexes}
              pagination={false}
              rowKey={(record) => record.name}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddIndex} ghost>
                  {t('new_index')}
                </Button>
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

export default CreateEntity;
