import React from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from 'react-i18next';
import TextArea from 'antd/es/input/TextArea';

interface NativeQueryFormProps {
  form: any;
}

const NativeQueryForm: React.FC<NativeQueryFormProps> = ({ form }) => {
  const { t } = useTranslation();

  return (
    <div style={{ padding: '16px 0' }}>
      <Form form={form} layout="vertical">
        <Form.Item name="name" label={t('name')} rules={[{required: true}]}>
          <Input size="small"/>
        </Form.Item>
        <Form.Item name="statement" label={t('statement')} rules={[{required: true}]}>
          <TextArea rows={4} size="small"/>
        </Form.Item>
      </Form>
    </div>
  );
};

export default NativeQueryForm;
