import React, {useEffect, useState} from 'react';
import {Button, Form, InputNumber, Switch} from 'antd';
import {useTranslation} from "react-i18next";

interface SecurityProps {
  settings: any;
  onChange: (val: any) => void;
}

interface SecurityData {
  rateLimitingEnabled: boolean;
  intervalInSeconds: number;
  maxRequestCount: number;
}

const Base: React.FC<SecurityProps> = ({settings, onChange}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<SecurityData>({
    rateLimitingEnabled: false,
    intervalInSeconds: 60,
    maxRequestCount: 500
  })

  useEffect(() => {
    form.setFieldsValue(settings.security);
    setFormData(settings.security);
  }, [settings, form]);

  const submit = async () => {
    const values = await form.validateFields();
    onChange({...settings, security: values})
  };

  return (
    <div style={{width: 600, marginTop: 20}}>
      <Form form={form}
            initialValues={formData}
            layout="vertical"
            onValuesChange={(changedValues) => setFormData((prev: any) => ({...prev, ...changedValues}))}
      >
        <Form.Item name="rateLimitingEnabled" label={t('settings_global_api_rate_limiting')}>
          <Switch/>
        </Form.Item>
        {formData?.rateLimitingEnabled && <>
          <Form.Item name="intervalInSeconds" label={t('interval_in_seconds')} required>
            <InputNumber min={1} addonAfter={t('sec')}/>
          </Form.Item>
          <Form.Item name="maxRequestCount" label={t('max_request_count')} required>
            <InputNumber min={1} addonAfter={t('times')}/>
          </Form.Item>
        </>}
        <Form.Item>
          <Button type="primary" onClick={submit}>{t('save')}</Button>
        </Form.Item>
      </Form>
    </div>

  );
};

export default Base;
