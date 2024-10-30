import React from 'react';
import {Form, Input, Modal} from 'antd';
import {useTranslation} from "react-i18next";

interface EditProviderProps {
  visible: boolean;
  data: any;
  onCancel: () => void;
  onConfirm: (form: any) => void;
}

const EditProvider: React.FC<EditProviderProps> = ({visible, data, onCancel, onConfirm}) => {

  const {t} = useTranslation();

  const [form] = Form.useForm();

  const handleConfirm = async () => {
    const values = await form.validateFields();
    onConfirm(values);
  };

  return (
    <Modal
      title={t('idp_edit_provider')}
      open={visible}
      onOk={handleConfirm}
      onCancel={onCancel}
    >
      <Form form={form} layout="vertical" initialValues={data}>
        {/* Connection Name */}
        <Form.Item name="name" label={t('idp_provider_type')}>
          <Input disabled/>
        </Form.Item>

        {/* OIDC Provider, assuming this is a custom component */}
        <Form.Item name="type" label={t('idp_provider_type')}>
          <Input disabled/>
        </Form.Item>
        <Form.Item
          label={t('idp_issuer')}
          name="issuer"
          rules={[{required: true}]}
        >
          <Input placeholder="e.g. http://localhost:8080/realms/master"/>
        </Form.Item>

        {/* Client ID */}
        <Form.Item
          label={t('idp_client_id')}
          name="clientId"
          rules={[{required: true}]}
        >
          <Input/>
        </Form.Item>

        {/* Client Secret */}
        <Form.Item
          label={t('idp_client_secret')}
          name="clientSecret"
          rules={[{required: true}]}
        >
          <Input/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditProvider;
