import React, {useEffect, useState} from 'react';
import {Card, Form, Select, Switch} from "antd";
import {SelectProps} from "rc-select/lib/Select";
import {getIdentityProviders} from "../../../api/identity-provider.ts";

interface AuthProps {
  data: {
    auth: boolean;
    identityProvider: string;
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
    onChange({auth: formData?.auth, identityProvider: formData?.auth ? formData.identityProvider : undefined});
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
        <Form.Item name="auth" label="Auth">
          <Switch/>
        </Form.Item>
        {formData?.auth && <Form.Item name="identityProvider" label="Identity Provider" required>
          <Select options={options} placeholder="Select a provider"/>
        </Form.Item>}
      </Form>
    </Card>
  );
};

export default Authorization;
