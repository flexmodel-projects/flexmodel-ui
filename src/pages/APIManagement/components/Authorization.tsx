import React, {useEffect, useState} from 'react';
import {Card, Form, InputNumber, Select, Switch} from "antd";
import {SelectProps} from "rc-select/lib/Select";
import {getIdentityProviders} from "../../../api/identity-provider.ts";

interface AuthProps {
  data: {
    auth: boolean;
    rateLimitingEnabled: boolean;
    identityProvider: string;
    limitRefreshPeriod: number;
    maxRequests: number;
  }
  onChange: (data: any) => void;
}

const Authorization: React.FC<AuthProps> = ({data, onChange}: AuthProps) => {

  const [formData, setFormData] = useState(data);
  const [form] = Form.useForm();

  const [options, setOptions] = useState<SelectProps['options']>([]);

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
      limitRefreshPeriod: formData?.limitRefreshPeriod ? formData.limitRefreshPeriod : undefined,
      maxRequests: formData?.maxRequests ? formData.maxRequests : undefined,
    });
  }, [formData]);

  return (
    <Card>
      <Form
        form={form}
        initialValues={data}
        labelCol={{span: 4}}
        wrapperCol={{span: 20}}
        layout="horizontal"
        onValuesChange={(changedValues) => setFormData((prev: any) => ({...prev, ...changedValues}))}
      >
        <Form.Item name="auth" label="API Auth">
          <Switch/>
        </Form.Item>
        {formData?.auth && <Form.Item name="identityProvider" label="Identity Provider" required>
          <Select options={options} placeholder="Select a provider"/>
        </Form.Item>}
        <Form.Item name="rateLimitingEnabled" label="API rate limiting">
          <Switch/>
        </Form.Item>
        {formData?.rateLimitingEnabled && <>
          <Form.Item name="limitRefreshPeriod" label="Limit refresh period" required>
            <InputNumber defaultValue={60} addonAfter={"sec"}/>
          </Form.Item>
          <Form.Item name="maxRequests" label="max requests of limit" required>
            <InputNumber defaultValue={500} addonAfter={"times"}/>
          </Form.Item>
        </>}
      </Form>
    </Card>
  );
};

export default Authorization;
