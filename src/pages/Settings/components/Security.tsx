import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Select, Switch} from 'antd';
import {useTranslation} from "react-i18next";
import {SelectProps} from "rc-select/lib/Select";
import {getIdentityProviders} from "@/services/identity-provider.ts";
import {RootState} from "@/store/configStore.ts";
import {useSelector} from "react-redux";

interface SecurityProps {
  settings: any;
  onChange: (val: any) => void;
}

interface SecurityData {
  rateLimitingEnabled: boolean;
  intervalInSeconds: number;
  maxRequestCount: number;
  graphqlEndpointEnabled: boolean;
  graphqlEndpointPath?: string;
  graphqlEndpointIdentityProvider?: string | null;
}

const Base: React.FC<SecurityProps> = ({settings, onChange}) => {
  const {t} = useTranslation();

  const { config } = useSelector((state: RootState) => state.config);

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<SecurityData>({
    rateLimitingEnabled: false,
    intervalInSeconds: 60,
    maxRequestCount: 500,
    graphqlEndpointEnabled: false,
    graphqlEndpointPath: '/graphql',
    graphqlEndpointIdentityProvider: null
  });
  const [options, setOptions] = useState<SelectProps['options']>([]);

  useEffect(() => {
    getIdentityProviders()
      .then(res => setOptions(res.map((d: { name: string }) => ({
        value: d.name,
        label: d.name,
      }))));
  }, []);

  useEffect(() => {
    form.setFieldsValue(settings.security);
    setFormData(settings.security);
  }, [settings, form]);

  const submit = async () => {
    const values = await form.validateFields();
    onChange({...settings, security: values})
  };

  return (

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
        <Form.Item name="graphqlEndpointEnabled" label={t('graphql_endpoint_enabled')}>
          <Switch/>
        </Form.Item>
        {formData?.graphqlEndpointEnabled && <>
          <Form.Item name="graphqlEndpointPath" label={t('graphql_endpoint_path')} required>
            <Input addonBefore={config?.application['flexmodel.context-path']}/>
          </Form.Item>
          <Form.Item name="graphqlEndpointIdentityProvider" label={t('graphql_identity_provider')}>
            <Select options={options} placeholder={t('select_a_provider')} allowClear/>
          </Form.Item>
        </>}
        <Form.Item>
          <Button type="primary" onClick={submit}>{t('save')}</Button>
        </Form.Item>
      </Form>
  );
};

export default Base;
