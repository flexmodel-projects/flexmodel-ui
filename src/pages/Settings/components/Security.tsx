import React, {useEffect, useState} from 'react';
import {Button, Form, InputNumber, Switch} from 'antd';

interface SecurityProps {
  settings: any;
  onChange: (val: any) => void;
}

interface SecurityData {
  apiRateLimitingEnabled: boolean;
  limitRefreshPeriod: number;
  maxRequests: number;
}

const Base: React.FC<SecurityProps> = ({settings, onChange}) => {

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<SecurityData>({
    apiRateLimitingEnabled: false,
    limitRefreshPeriod: 60,
    maxRequests: 500
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
        <Form.Item name="apiRateLimitingEnabled" label="Global API Rate Limiting">
          <Switch/>
        </Form.Item>
        {formData?.apiRateLimitingEnabled && <>
          <Form.Item name="limitRefreshPeriod" label="Limit Refresh Period" required>
            <InputNumber min={1} addonAfter={"sec"}/>
          </Form.Item>
          <Form.Item name="maxRequests" label="Max Requests" required>
            <InputNumber min={1} addonAfter={"times"}/>
          </Form.Item>
        </>}
        <Form.Item>
          <Button type="primary" onClick={submit}>Save</Button>
        </Form.Item>
      </Form>
    </div>

  );
};

export default Base;
