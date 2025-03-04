import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, Select, Switch} from 'antd';
import {getModelList} from '../../../api/model'; // 替换为你的 API 调用
import {BasicFieldTypes, FieldInitialValues, IDGeneratedValues} from "../common.ts";
import {useTranslation} from "react-i18next";
import FieldInput from "./FieldInput.tsx"; // 替换为你的组件

interface FieldFormProps {
  visible: boolean;
  datasource: any;
  model: any;
  currentValue: any;
  onConfirm: (form: any) => void;
  onCancel: () => void;
}

const FieldForm: React.FC<FieldFormProps> = ({visible, datasource, model, currentValue, onConfirm, onCancel}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const [modelList, setModelList] = useState<any[]>([]);
  const [hasId, setHasId] = useState<boolean>(false);
  const [relationModel, setRelationModel] = useState<any>();
  const [tmpType, setTmpType] = useState<string>('');

  useEffect(() => {
    if (visible) {
      reqModelList();
    }
  }, [visible]);

  useEffect(() => {
    if (currentValue) {
      let tmpType = currentValue.type;
      if (currentValue.type === 'RELATION') {
        tmpType = `RELATION:${currentValue.from}`;
        setTmpType(`RELATION:${currentValue.from}`);
        if (!currentValue.localField) {
          form.setFieldValue('localField', model.fields.filter((f: any) => f.type === 'id')[0]?.name);
        }
      } else if (currentValue.type === 'ENUM') {
        tmpType = `ENUM:${currentValue.from}`;
      } else {
        setTmpType(currentValue.type);
      }
      form.setFieldsValue({
        ...currentValue,
        tmpType: tmpType
      });
    }
  }, [currentValue]);

  useEffect(() => {
    if (tmpType.startsWith('RELATION')) {
      const relationName = tmpType.replace('RELATION:', '').replace('[]', '');
      const relatedModel = modelList.find(m => m.name === relationName);
      setRelationModel(relatedModel);
      if (!currentValue.localField) {
        form.setFieldValue('localField', model.fields.filter((f: any) => f.type === 'ID')[0]?.name);
      }
    } else {
      setRelationModel(null);
    }
  }, [modelList, tmpType]);

  const reqModelList = async () => {
    const data = await getModelList(datasource);
    setModelList(data);
    setHasId(model.fields?.some((f: any) => f.type === 'ID'));
  };

  const handleTypeChange = (value: string) => {
    setTmpType(value);
    if (value.startsWith("RELATION")) {
      form.setFieldsValue({...FieldInitialValues[value], type: "RELATION", from: value.replace('RELATION:', '')});
    } else if (value.startsWith("ENUM")) {
      form.setFieldsValue({...FieldInitialValues[value], type: "ENUM", from: value.replace('ENUM:', '')});
    } else {
      form.setFieldsValue({...FieldInitialValues[value], type: value});
    }
  };

  const handleConfirm = () => {
    form.validateFields().then(values => {
      onConfirm(values);
    });
  };

  return (
    <Modal open={visible} onCancel={onCancel} onOk={handleConfirm}
           title={currentValue?.name ? t('edit_field') : t('new_field')}>
      <Form form={form} labelCol={{span: 6}} wrapperCol={{span: 18}} layout="horizontal">
        <Form.Item label={t('name')} name="name" rules={[{required: true}]}>
          <Input disabled={!!currentValue?.name}/>
        </Form.Item>
        <Form.Item label={t('comment')} name="comment">
          <Input/>
        </Form.Item>
        <Form.Item name="type" hidden><Input/></Form.Item>
        <Form.Item name="from" hidden><Input/></Form.Item>
        <Form.Item label={t('type')} name="tmpType" rules={[{required: true}]}>
          <Select value={tmpType} onChange={handleTypeChange}>
            <Select.OptGroup label={t('select_group_id')}>
              <Select.Option value="ID" disabled={hasId}>ID</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label={t('select_group_basic_field')}>
              {BasicFieldTypes.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t('select_group_relation')}>
              {modelList.filter(item => item.type === 'ENTITY').map(item => (
                <Select.Option key={item.name} value={`RELATION:${item.name}`}>{item.name}</Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t('select_group_enumeration')}>
              {modelList.filter(item => item.type === 'ENUM').map(item => (
                <Select.Option key={item.name} value={`ENUM:${item.name}`}>{item.name}</Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {/* 以下是根据类型动态渲染的部分 */}
        {form.getFieldValue('tmpType') === 'ID' && (
          <Form.Item label="Generated value" name="generatedValue">
            <Select>
              {IDGeneratedValues.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {form.getFieldValue('tmpType') === 'STRING' && (
          <Form.Item label={t('length')} name="length">
            <Input type="number"/>
          </Form.Item>
        )}

        {form.getFieldValue('tmpType') === 'DECIMAL' && (
          <>
            <Form.Item label={t('precision')} name="precision">
              <Input type="number"/>
            </Form.Item>
            <Form.Item label={t('scale')} name="scale">
              <Input type="number"/>
            </Form.Item>
          </>
        )}

        {form.getFieldValue('tmpType')?.startsWith('RELATION') && (
          <>
            <Form.Item label={t('local_field')} name="localField" rules={[{required: true}]}>
              <Select>
                {model?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('foreign_field')} name="foreignField" rules={[{required: true}]}>
              <Select>
                {relationModel?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('selection_multiple')} name="multiple" valuePropName="checked">
              <Switch/>
            </Form.Item>
            <Form.Item label={t('cascade_delete')} name="cascadeDelete" valuePropName="checked">
              <Switch/>
            </Form.Item>
          </>
        )}

        {form.getFieldValue('tmpType')?.startsWith('ENUM') && (
          <>
            <Form.Item label={t('selection_multiple')} name="multiple" valuePropName="checked">
              <Switch/>
            </Form.Item>
          </>
        )}

        {!(['ID', 'RELATION'].includes(form.getFieldValue('tmpType'))
          || form.getFieldValue('tmpType')?.startsWith('RELATION')) && (
          <>
            <Form.Item label={t('default_value')} name="defaultValue">
              <FieldInput field={form.getFieldsValue()} modelList={modelList} value={undefined}
                          onChange={function (val: any): void {
                            console.log(val)
                          }}/>
            </Form.Item>
            <Form.Item label={t('nullable')} name="nullable" valuePropName="checked">
              <Switch/>
            </Form.Item>
            <Form.Item label={t('unique')} name="unique" valuePropName="checked">
              <Switch/>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FieldForm;
