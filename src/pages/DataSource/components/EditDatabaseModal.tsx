import React, {useEffect, useState} from 'react';
import {Form, Input, Modal} from 'antd';
import {useTranslation} from "react-i18next";

interface EditDatabaseProps {
  visible: boolean;
  datasource: {
    name: string;
    enabled: boolean;
    config: {
      dbKind: string;
      url: string;
      username: string;
      password: string;
    }
  };
  onConfirm: (formData: any) => void;
  onCancel: () => void;
}

const EditDatabaseModal: React.FC<EditDatabaseProps> = ({visible, datasource, onConfirm, onCancel}) => {
  const {t} = useTranslation();

  const [form] = Form.useForm();
  const [isVisible, setIsVisible] = useState(visible);

  useEffect(() => {
    setIsVisible(visible);
    form.setFieldsValue({
      name: datasource.name,
      dbKind: datasource.config.dbKind,
      url: datasource.config.url,
      username: datasource.config.username,
      password: datasource.config.password,
    });
  }, [visible, datasource, form]);

  const handleCancel = () => {
    onCancel();
    setIsVisible(false);
  };

  const handleConfirm = () => {
    form
      .validateFields()
      .then(values => {
        onConfirm(values);
        setIsVisible(false);
      })
      .catch(errorInfo => {
        console.log('Validation Failed:', errorInfo);
      });
  };

  return (
    <Modal
      title={t('connect_edit_database')}
      open={isVisible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      width={500}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          name: datasource.name,
          url: datasource?.config?.url,
          username: datasource?.config?.username,
          password: datasource?.config?.password,
        }}
      >
        <Form.Item name="dbKind" hidden/>
        <Form.Item label={t('connection_name')} name="name">
          <Input readOnly/>
        </Form.Item>
        <Form.Item
          name="url"
          label={t('database_url')}
          rules={[{required: true}]}
        >
          <Input/>
        </Form.Item>
        <Form.Item name="username" label={t('username')}>
          <Input/>
        </Form.Item>
        <Form.Item name="password" label={t('password')}>
          <Input placeholder="password"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditDatabaseModal;
