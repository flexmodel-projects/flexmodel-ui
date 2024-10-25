import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Switch, Radio } from 'antd';
import { getModelList } from '../../../api/model'; // 替换为你的 API 调用
import { BasicFieldTypes, FieldInitialValues, IDGeneratedValues, ValidatorTypes, GeneratorTypes } from './types'; // 替换为你的 types
import FieldGeneratorList from './FieldGeneratorList.tsx'; // 替换为你的组件
import FieldValidatorList from './FieldValidatorList'; // 替换为你的组件

interface FieldFormProps {
  visible: boolean;
  datasource: any;
  model: any;
  currentValue: any;
  onConfirm: (form: any) => void;
  onCancel: () => void;
}

const FieldForm: React.FC<FieldFormProps> = ({ visible, datasource, model, currentValue, onConfirm, onCancel }) => {
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
    form.setFieldsValue({ ...FieldInitialValues[value], type: value });
  };

  const handleConfirm = () => {
    form.validateFields().then(values => {
      onConfirm(values);
    });
  };

  return (
    <Modal open={visible} onCancel={onCancel} onOk={handleConfirm} title={currentValue?.name ? 'Edit field' : 'New field'}>
      <Form form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
        <Form.Item label="Name" name="name" rules={[{ required: true }]}>
          <Input disabled={!!currentValue?.name} />
        </Form.Item>
        <Form.Item label="Comment" name="comment">
          <Input />
        </Form.Item>
        <Form.Item label="Type" name="type" rules={[{ required: true }]}>
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
          <Form.Item label="Length" name="length">
            <Input type="number" />
          </Form.Item>
        )}

        {form.getFieldValue('type') === 'decimal' && (
          <>
            <Form.Item label="Precision" name="precision">
              <Input type="number" />
            </Form.Item>
            <Form.Item label="Scale" name="scale">
              <Input type="number" />
            </Form.Item>
          </>
        )}

        {form.getFieldValue('type')?.startsWith('relation') && (
          <>
            <Form.Item label="Target field" name="targetField" rules={[{ required: true }]}>
              <Select>
                {relationModel?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="Cardinality" name="cardinality">
              <Radio.Group>
                <Radio value="ONE_TO_ONE">One to one</Radio>
                <Radio value="ONE_TO_MANY">One to many</Radio>
                <Radio value="MANY_TO_MANY">Many to many</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item label="Cascade delete" name="cascadeDelete" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        )}

        {/* Value generator */}
        {GeneratorTypes[form.getFieldValue('type')]?.length > 0 && (
          <Form.Item label="Default value" name="generator">
            <FieldGeneratorList
              datasource={datasource}
              model={model}
              field={form.getFieldValue('name')}
            />
          </Form.Item>
        )}

        {/* Value validators */}
        {ValidatorTypes[form.getFieldValue('type')]?.length > 0 && (
          <Form.Item label="Value validators" name="validators">
            <FieldValidatorList
              datasource={datasource}
              model={model}
              field={form.getFieldValue('name')}
            />
          </Form.Item>
        )}

        {!['id', 'relation'].includes(form.getFieldValue('type')) && (
          <>
            <Form.Item label="Nullable" name="nullable" valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="Unique" name="unique" valuePropName="checked">
              <Switch />
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FieldForm;
