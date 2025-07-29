import React, {useEffect, useState} from 'react';
import {Button, Form, Input, Space, Switch} from 'antd';
import {useTranslation} from "react-i18next";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useConfig} from "@/store/appStore.ts";

interface BaseProps {
  settings: any;
  onChange: (val: any) => void;
}

interface FormData {
  routesEnabled: boolean;
  routes: { path: string, to: string }[];
}

const Proxy: React.FC<BaseProps> = ({ settings, onChange }) => {

  const { t } = useTranslation();

  const { config } = useConfig();

  const [form] = Form.useForm();
  const [formData, setFormData] = useState<FormData>({
    routesEnabled: false,
    routes: [],
  });

  useEffect(() => {
    form.setFieldsValue(settings.proxy);
    setFormData(settings.proxy);
  }, [settings, form]);

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  const submit = async () => {
    const values = await form.validateFields();
    onChange({ ...settings, proxy: values })
  };

  return (
    <Form form={form}
      layout="vertical"
      onFinish={onFinish}
      style={{ maxWidth: 800 }}
      autoComplete="off"
      onValuesChange={(changedValues) => setFormData((prev: any) => ({ ...prev, ...changedValues }))}
    >
      <Form.Item name="routesEnabled" label={t('settings_routes')}>
        <Switch />
      </Form.Item>
      {formData?.routesEnabled &&
        <Form.List name="routes">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                  <Form.Item
                    {...restField}
                    name={[name, 'path']}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="path, e.g. /hello/**" prefix={config?.application['flexmodel.context-path']} />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'to']}
                    rules={[{ required: true }]}
                  >
                    <Input placeholder="to, e.g. http://localhost:8080/hello" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  {t('settings_add_route')}
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      }
      <Form.Item>
        <Button type="primary" onClick={submit}>{t('save')}</Button>
      </Form.Item>
    </Form>
  );
};

export default Proxy;
