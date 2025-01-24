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
      form.setFieldsValue({
        ...currentValue,
        tmpType: currentValue.type === 'relation' ? 'relation:' + currentValue.from : currentValue.type
      });
      if (currentValue.type === 'relation') {
        setTmpType(`relation:${currentValue.from}`);
        if (!currentValue.localField) {
          form.setFieldValue('localField', model.fields.filter((f: any) => f.type === 'id')[0]?.name);
        }
      } else {
        setTmpType(currentValue.type);
      }
    }
  }, [currentValue]);

  useEffect(() => {
    if (tmpType.startsWith('relation')) {
      const relationName = tmpType.replace('relation:', '').replace('[]', '');
      const relatedModel = modelList.find(m => m.name === relationName);
      setRelationModel(relatedModel);
      if (!currentValue.localField) {
        form.setFieldValue('localField', model.fields.filter((f: any) => f.type === 'id')[0]?.name);
      }
    } else {
      setRelationModel(null);
    }
  }, [modelList, tmpType]);

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
      if (values.tmpType.startsWith('relation:')) {
        onConfirm({
          ...values,
          type: 'relation',
          from: values.tmpType.replace('relation:', '')
        });
      } else {
        onConfirm({
          ...values,
          type: values.tmpType
        });
      }

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
        <Form.Item label={t('type')} name="tmpType" rules={[{required: true}]}>
          <Select value={tmpType} onChange={handleTypeChange} filterOption>
            <Select.OptGroup label={t('select_group_id')}>
              <Select.Option value="id" disabled={hasId}>ID</Select.Option>
            </Select.OptGroup>
            <Select.OptGroup label={t('select_group_basic_field')}>
              {BasicFieldTypes.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t('select_group_relation')}>
              {modelList.map(item => (
                <Select.Option key={item.name} value={`relation:${item.name}`}>{item.name}</Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {/* 以下是根据类型动态渲染的部分 */}
        {form.getFieldValue('tmpType') === 'id' && (
          <Form.Item label="Generated value" name="generatedValue">
            <Select>
              {IDGeneratedValues.map(item => (
                <Select.Option key={item.name} value={item.name}>{item.label}</Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}

        {form.getFieldValue('tmpType') === 'string' && (
          <Form.Item label={t('length')} name="length">
            <Input type="number"/>
          </Form.Item>
        )}

        {form.getFieldValue('tmpType') === 'decimal' && (
          <>
            <Form.Item label={t('precision')} name="precision">
              <Input type="number"/>
            </Form.Item>
            <Form.Item label={t('scale')} name="scale">
              <Input type="number"/>
            </Form.Item>
          </>
        )}

        {form.getFieldValue('tmpType')?.startsWith('relation') && (
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

        {!(['id', 'relation'].includes(form.getFieldValue('tmpType')) || form.getFieldValue('tmpType')?.startsWith('relation')) && (
          <>
            <Form.Item label={t('default_value')} name="defaultValue">
              <FieldInput field={form.getFieldsValue()} value={undefined} onChange={function (val: any): void {
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
