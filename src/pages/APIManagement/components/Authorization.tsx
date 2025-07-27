import React, {useEffect, useState} from 'react';
import {Card, Form, InputNumber, Select, Switch} from "antd";
import {SelectProps} from "rc-select/lib/Select";
import {getIdentityProviders} from "../../../services/identity-provider.ts";
import {useTranslation} from "react-i18next";

interface AuthProps {
  data: {
    auth: boolean;
    rateLimitingEnabled: boolean;
    identityProvider: string;
    intervalInSeconds: number;
    maxRequestCount: number;
  }
  onChange: (data: any) => void;
}

const Authorization: React.FC<AuthProps> = ({data, onChange}: AuthProps) => {

  const [formData, setFormData] = useState(data);
  const [form] = Form.useForm();

  const [options, setOptions] = useState<SelectProps['options']>([]);
  const { t } = useTranslation();

  useEffect(() => {
    getIdentityProviders()
      .then(res => setOptions(res.map((d: { name: string }) => ({
        value: d.name,
        label: d.name,
      }))));
  }, []);

  useEffect(() => {
    form.setFieldsValue(data);
    setFormData(data);
  }, [data, form]);

  useEffect(() => {
    onChange({
      auth: formData?.auth,
      identityProvider: formData?.auth ? formData.identityProvider : undefined,
      rateLimitingEnabled: formData?.rateLimitingEnabled,
      intervalInSeconds: formData?.intervalInSeconds ? formData.intervalInSeconds : undefined,
      maxRequestCount: formData?.maxRequestCount ? formData.maxRequestCount : undefined,
    });
  }, [formData]);

  return (
    <Card style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Form
        form={form}
        initialValues={data}
        labelCol={{span: 4}}
        wrapperCol={{span: 20}}
        layout="horizontal"
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        onValuesChange={(changedValues) => setFormData((prev: any) => ({...prev, ...changedValues}))}
      >
        <Form.Item name="auth" label={t('api_auth')}>
          <Switch/>
        </Form.Item>
        {formData?.auth && <Form.Item name="identityProvider" label={t('identity_provider')} required>
          <Select options={options} placeholder={t('select_a_provider')}/>
        </Form.Item>}
        <Form.Item name="rateLimitingEnabled" label={t('api_rate_limiting')}>
          <Switch/>
        </Form.Item>
        {formData?.rateLimitingEnabled && <>
          <Form.Item name="intervalInSeconds" label={t('interval_in_seconds')} required>
            <InputNumber defaultValue={60} addonAfter={t('sec')}/>
          </Form.Item>
          <Form.Item name="maxRequestCount" label={t('max_request_count')} required>
            <InputNumber defaultValue={500} addonAfter={t('times')}/>
          </Form.Item>
        </>}
      </Form>
    </Card>
  );
};

export default Authorization;
