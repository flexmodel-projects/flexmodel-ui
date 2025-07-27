import React, {useEffect} from 'react';
import {Button, Form, Input} from 'antd';
import {useTranslation} from "react-i18next";

interface BaseProps {
  settings: any;
  onChange: (val: any) => void;
}

const Base: React.FC<BaseProps> = ({ settings, onChange }) => {

  const { t } = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(settings);
  }, [settings, form]);

  const submit = () => {
    form.validateFields().then(values => {
      onChange(values)
    });
  };

  return (
    <Form form={form} layout="vertical">
      <Form.Item name="appName" label={t('settings_app_name')}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={submit}>{t('save')}</Button>
      </Form.Item>
    </Form>
  );
};

export default Base;
