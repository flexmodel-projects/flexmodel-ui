import React, {useEffect, useState} from 'react';
import {Form, Input, Modal, Radio, Select, Switch} from 'antd';
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
      form.setFieldsValue(currentValue);
      if (currentValue.type === 'relation') {
        setTmpType(`relation:${currentValue.targetEntity}`);
      } else {
        setTmpType(currentValue.type);
      }
    }
  }, [currentValue]);

  useEffect(() => {
    if (tmpType.startsWith('relation')) {
      const relationName = tmpType.replace('relation:', '');
      const relatedModel = modelList.find(m => m.name === relationName);
      form.setFieldValue('cardinality', 'ONE_TO_ONE');
      setRelationModel(relatedModel);
    } else {
      setRelationModel(null);
    }
  }, [tmpType]);

  const reqModelList = async () => {
    const data = await getModelList(datasource);
    setModelList(data);
    setHasId(model.fields?.some((f: any) => f.type === 'id'));
  };

  const handleTypeChange = (value: string) => {
    setTmpType(value);
    form.setFieldsValue({...FieldInitialValues[value], type: value});
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
        <Form.Item label={t('type')} name="type" rules={[{required: true}]}>
          <Select value={tmpType} onChange={handleTypeChange} filterOption>
            <Select.OptGroup label="ID">
              <Select.Option value="id" disabled={hasId}>ID</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label="Basic field">
              {BasicFieldTypes.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label="Relation">
              {modelList.map(item => (
                <Select.Option key={item.name} value={`relation:${item.name}`}>{item.name}</Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {/* 以下是根据类型动态渲染的部分 */}
        {form.getFieldValue('type') === 'id' && (
          <Form.Item label="Generated value" name="generatedValue">
            <Select>
              {IDGeneratedValues.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {form.getFieldValue('type') === 'string' && (
          <Form.Item label={t('length')} name="length">
            <Input type="number"/>
          </Form.Item>
        )}

        {form.getFieldValue('type') === 'decimal' && (
          <>
            <Form.Item label={t('precision')} name="precision">
              <Input type="number"/>
            </Form.Item>
            <Form.Item label={t('scale')} name="scale">
              <Input type="number"/>
            </Form.Item>
          </>
        )}

        {form.getFieldValue('type')?.startsWith('relation') && (
          <>
            <Form.Item label={t('target_field')} name="targetField" rules={[{required: true}]}>
              <Select>
                {relationModel?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label={t('cardinality')} name="cardinality">
              <Radio.Group>
                <Radio value="ONE_TO_ONE">{t('one_to_one')}</Radio>
                <Radio value="ONE_TO_MANY">{t('one_to_many')}</Radio>
                <Radio value="MANY_TO_MANY">{t('many_to_many')}</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={t('cascade_delete')} name="cascadeDelete" valuePropName="checked">
              <Switch/>
            </Form.Item>
          </>
        )}

        <Form.Item label={t('default_value')} name="defaultValue">
          <FieldInput field={form.getFieldsValue()} value={undefined} onChange={function (val: any): void {
            console.log(val)
          }}/>
        </Form.Item>

        {!['id', 'relation'].includes(form.getFieldValue('type')) && (
          <>
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
