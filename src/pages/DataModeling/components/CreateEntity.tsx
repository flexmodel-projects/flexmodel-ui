import React, {useState} from 'react';
import {Button, Drawer, Form, Input, notification, Table, theme} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {createModel} from '@/services/model.ts';
import {useTranslation} from 'react-i18next';
import FieldForm from './FieldForm.tsx';
import IndexForm from './IndexForm.tsx';
import {Entity, Field, Index} from '@/types/data-modeling';


interface CreateEntityProps {
  visible: boolean;
  datasource: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CreateEntity: React.FC<CreateEntityProps> = ({
  visible,
  datasource,
  onConfirm,
  onCancel,
}) => {
  const {t} = useTranslation();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [model, setModel] = useState<Entity>({
    name: '',
    type: 'ENTITY',
    fields: [],
    indexes: [],
  });
  const [changeFieldDialogVisible, setChangeFieldDialogVisible] = useState(false);
  const [changeIndexDialogVisible, setChangeIndexDialogVisible] = useState(false);
  const [fieldForm, setFieldForm] = useState<Field>({
    name: '',
    type: 'String',
    concreteType: 'String',
    unique: false,
    nullable: true,
    comment: '',
    fieldName: '',
    direction: 'ASC',
  });
  const [indexForm, setIndexForm] = useState<Index>({
    name: '',
    fields: [],
    unique: false,
  });

  const handleAddField = () => {
    setFieldForm({
      name: '',
      type: 'String',
      concreteType: 'String',
      unique: false,
      nullable: true,
      comment: '',
      fieldName: '',
      direction: 'ASC',
    });
    setChangeFieldDialogVisible(true);
  };

  const handleAddIndex = () => {
    setIndexForm({
      name: '',
      fields: [],
      unique: false,
    });
    setChangeIndexDialogVisible(true);
  };

  const addOrEditField = (values: Field) => {
    const updatedFields = [...model.fields];
    const existingIndex = updatedFields.findIndex(f => f.name === values.name);
    if (existingIndex >= 0) {
      updatedFields[existingIndex] = values;
    } else {
      updatedFields.push(values);
    }
    setModel({...model, fields: updatedFields});
    setChangeFieldDialogVisible(false);
  };

  const addOrEditIndex = (values: Index) => {
    const updatedIndexes = [...model.indexes];
    const existingIndex = updatedIndexes.findIndex(i => i.name === values.name);
    if (existingIndex >= 0) {
      updatedIndexes[existingIndex] = values;
    } else {
      updatedIndexes.push(values);
    }
    setModel({...model, indexes: updatedIndexes});
    setChangeIndexDialogVisible(false);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const entityData = {
        ...values,
        type: 'ENTITY',
        fields: model.fields,
        indexes: model.indexes,
      };
      await createModel(datasource, entityData);
      notification.success({message: t('form_save_success')});
      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  const fieldColumns = [
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {title: t('type'), dataIndex: 'type', key: 'type'},
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (value: boolean) => (value ? t('yes') : t('no'))},
    {title: t('nullable'), dataIndex: 'nullable', key: 'nullable', render: (value: boolean) => (value ? t('yes') : t('no'))},
    {title: t('comment'), dataIndex: 'comment', key: 'comment'},
  ];

  const indexColumns = [
    {title: t('name'), dataIndex: 'name', key: 'name'},
    {title: t('fields'), dataIndex: 'fields', key: 'fields', render: (fields: any[]) => fields.map(f => f.fieldName).join(', ')},
    {title: t('unique'), dataIndex: 'unique', key: 'unique', render: (value: boolean) => (value ? t('yes') : t('no'))},
  ];

  // 紧凑主题样式
  const formStyle = {};

  const tableStyle = {
    marginTop: token.marginSM,
  };

  return (
    <>
      <Drawer
        title={t('new_entity')}
        open={visible}
        onClose={onCancel}
        width={800}
        footer={
          <div style={{textAlign: 'right'}}>
            <Button onClick={onCancel} style={{marginRight: 8}}>
              {t('cancel')}
            </Button>
            <Button onClick={handleSubmit} type="primary">
              {t('confirm')}
            </Button>
          </div>
        }
      >
        <Form form={form} layout="vertical" style={formStyle}>
          <Form.Item name="name" label={t('name')} rules={[{required: true}]}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item name="comment" label={t('comment')} rules={[{required: true}]}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item label={t('fields')}>
            <Table
              size="small"
              columns={fieldColumns}
              dataSource={model.fields}
              pagination={false}
              rowKey={(record) => record.name}
              style={tableStyle}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddField} ghost size="small">
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
              style={tableStyle}
              footer={() => (
                <Button type="primary" icon={<PlusOutlined/>} style={{width: '100%'}} onClick={handleAddIndex} ghost size="small">
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

