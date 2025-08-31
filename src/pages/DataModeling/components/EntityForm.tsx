import React, {useState} from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from 'react-i18next';
import {Entity, Field, Index} from '@/types/data-modeling';
import FieldForm from './FieldForm';
import IndexForm from './IndexForm';
import FieldTable from './FieldTable';
import IndexTable from './IndexTable';

interface EntityFormProps {
  form: any;
  entityModel: Entity;
  datasource: string;
  onEntityModelChange: (model: Entity) => void;
}

const EntityForm: React.FC<EntityFormProps> = ({
  form,
  entityModel,
  datasource,
  onEntityModelChange,
}) => {
  const { t } = useTranslation();
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
    tmpType: 'String',
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
      tmpType: 'String',
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

  const handleEditField = (field: Field) => {
    setFieldForm(field);
    setChangeFieldDialogVisible(true);
  };

  const handleDeleteField = (fieldName: string) => {
    const updatedFields = entityModel.fields.filter(f => f.name !== fieldName);
    onEntityModelChange({...entityModel, fields: updatedFields});
  };

  const handleEditIndex = (index: Index) => {
    setIndexForm(index);
    setChangeIndexDialogVisible(true);
  };

  const handleDeleteIndex = (indexName: string) => {
    const updatedIndexes = entityModel.indexes.filter(i => i.name !== indexName);
    onEntityModelChange({...entityModel, indexes: updatedIndexes});
  };

  const addOrEditField = (values: Field) => {
    const updatedFields = [...entityModel.fields];
    const existingIndex = updatedFields.findIndex(f => f.name === values.name);
    if (existingIndex >= 0) {
      updatedFields[existingIndex] = values;
    } else {
      updatedFields.push(values);
    }
    onEntityModelChange({...entityModel, fields: updatedFields});
    setChangeFieldDialogVisible(false);
  };

  const addOrEditIndex = (values: Index) => {
    const updatedIndexes = [...entityModel.indexes];
    const existingIndex = updatedIndexes.findIndex(i => i.name === values.name);
    if (existingIndex >= 0) {
      updatedIndexes[existingIndex] = values;
    } else {
      updatedIndexes.push(values);
    }
    onEntityModelChange({...entityModel, indexes: updatedIndexes});
    setChangeIndexDialogVisible(false);
  };

  return (
    <>
      <div style={{ padding: '16px 0' }}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={t('name')} rules={[{required: true}]}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item name="comment" label={t('comment')} rules={[{required: true}]}>
            <Input size="small"/>
          </Form.Item>
          <Form.Item label={t('fields')}>
            <FieldTable
              fields={entityModel.fields}
              onEdit={handleEditField}
              onDelete={handleDeleteField}
              onAdd={handleAddField}
            />
          </Form.Item>
          <Form.Item label={t('indexes')}>
            <IndexTable
              indexes={entityModel.indexes}
              onEdit={handleEditIndex}
              onDelete={handleDeleteIndex}
              onAdd={handleAddIndex}
            />
          </Form.Item>
        </Form>
      </div>

      {/* 字段表单弹窗 */}
      <FieldForm
        visible={changeFieldDialogVisible}
        datasource={datasource}
        model={entityModel}
        currentValue={fieldForm}
        onConfirm={addOrEditField}
        onCancel={() => setChangeFieldDialogVisible(false)}
      />

      {/* 索引表单弹窗 */}
      <IndexForm
        visible={changeIndexDialogVisible}
        datasource={datasource}
        model={entityModel}
        currentValue={indexForm}
        onConfirm={addOrEditIndex}
        onCancel={() => setChangeIndexDialogVisible(false)}
      />
    </>
  );
};

export default EntityForm;
