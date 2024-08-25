import React, { useEffect, useState } from 'react';
import { Button, Form, Input, Modal } from 'antd';
import InputVariables from "../../../components/InputVariables.tsx";

interface EditDatabaseProps {
  visible: boolean;
  datasource: {
    name: string;
    url: string;
    username: string;
    password: string;
  };
  onConform: (formData: any) => void;
  onCancel: () => void;
}

const EditDatabaseDrawer: React.FC<EditDatabaseProps> = ({ visible, datasource, onConform, onCancel }) => {
  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    form.setFieldsValue({
      name: datasource.name,
      url: datasource.url,
      username: datasource.username,
      password: datasource.password,
    });
  }, [visible, datasource, form]);

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  const handleConform = () => {
    form
      .validateFields()
      .then(values => {
        onConform(values);
        setIsVisible(false);
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title="Edit Database"
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="conform" type="primary" onClick={handleConform}>
          Conform
        </Button>,
      ]}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: datasource.name,
          url: datasource.url,
          username: datasource.username,
          password: datasource.password,
        }}
      >
        <Form.Item label="Connection name" name="name">
          <Input value={datasource.name} readOnly />
        </Form.Item>
        <Form.Item
          name="url"
          label="Database URL"
          rules={[{ required: true, message: 'Please input the database URL!' }]}
        >
          <InputVariables />
        </Form.Item>
        <Form.Item name="username" label="Username">
          <InputVariables />
        </Form.Item>
        <Form.Item name="password" label="Password">
          <InputVariables placeholder="password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDatabaseDrawer;
