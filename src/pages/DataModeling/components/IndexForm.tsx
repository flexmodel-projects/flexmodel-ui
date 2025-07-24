import React, {useEffect} from 'react';
import {Form, Input, Modal, Select, Switch} from 'antd';
import type {Index} from "@/types/data-modeling";
import {useTranslation} from "react-i18next";

interface ChangeIndexProps {
  visible: boolean;
  datasource: string;
  model: any;
  currentValue: Index | undefined;
  onConfirm: (data: Index) => void;
  onCancel: () => void;
}

const IndexForm: React.FC<ChangeIndexProps> = ({visible, model, currentValue, onConfirm, onCancel}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    if (currentValue) {
      form.setFieldsValue({
        name: currentValue.name || '',
        fields: currentValue.fields?.map(field => field.direction ? `${field.fieldName}:${field.direction}` : field.fieldName) || [],
        unique: currentValue.unique || false
      });
    }
  }, [currentValue, form]);

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const fields = values.fields.map((f: string) => {
        let fieldName = f;
        let direction: 'ASC' | 'DESC' | undefined;
        if (f.endsWith('ASC')) {
          fieldName = f.replace(':ASC', '');
          direction = 'ASC';
        } else if (f.endsWith('DESC')) {
          fieldName = f.replace(':DESC', '');
          direction = 'DESC';
        }
        return {
          fieldName,
          direction,
        };
      });

      onConfirm({
        name: values.name,
        fields,
        unique: values.unique,
      });
    }).catch(info => {
      console.log('Validate Failed:', info);
    });
  };

  return (
    <Modal
      title={currentValue?.name ? t('edit_index') : t('new_index')}
      open={visible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={580}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: '',
          fields: [],
          unique: false,
        }}
      >
        <Form.Item
          name="name"
          label={t('name')}
          rules={[{required: true}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item
          name="fields"
          label={t('fields')}
          rules={[{required: true}]}
        >
          <Select mode="multiple" allowClear>
            {model.fields.map((field: any) => (
              <Select.Option key={field.name} value={field.name}>{field.name}</Select.Option>
            ))}
            <Select.OptGroup label={t('field_desc')}>
              {model.fields.map((field: any) => (
                <Select.Option key={`${field.name}:DESC`} value={`${field.name}:DESC`}>
                  {`${field.name} DESC`}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t('field_asc')}>
              {model.fields.map((field: any) => (
                <Select.Option key={`${field.name}:ASC`} value={`${field.name}:ASC`}>
                  {`${field.name} ASC`}
                </Select.Option>
              ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>
        <Form.Item name="unique" label={t('unique')} valuePropName="checked">
          <Switch/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default IndexForm;
