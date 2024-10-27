import React, {useEffect} from 'react';
import {Button, Form, Input} from 'antd';

interface BaseProps {
  settings: any;
  onChange: (val: any) => void;
}

const Base: React.FC<BaseProps> = ({settings, onChange}) => {

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
    <div style={{width: 600, marginTop: 20}}>
      <Form form={form} layout="vertical">
        <Form.Item name="appName" label="Application Name">
          <Input/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={submit}>Save</Button>
        </Form.Item>
      </Form>
    </div>

  );
};

export default Base;
