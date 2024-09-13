import React from 'react';
import { Modal, Form, Input, Button } from 'antd';
import OIdcProvider from "./OIdcProvider.tsx";

interface EditProviderProps {
  visible: boolean;
  form: any;
  onCancel: () => void;
  onConfirm: (form: any) => void;
}

const EditProvider: React.FC<EditProviderProps> = ({ visible, form, onCancel, onConfirm }) => {
  const [currentForm, setCurrentForm] = React.useState(form);

  const handleConfirm = () => {
    onConfirm(currentForm);
  };

  return (
    <Modal
      title="Edit provider"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleConfirm}>
          Confirm
        </Button>,
      ]}
    >
      <Form layout="vertical">
        {/* Connection Name */}
        <Form.Item label="Connection name">
          <Input value={currentForm?.name} readOnly disabled />
        </Form.Item>

        {/* OIDC Provider, assuming this is a custom component */}
        <OIdcProvider provider={currentForm?.provider} setProvider={(provider) => setCurrentForm({ ...currentForm, provider })} />
      </Form>
    </Modal>
  );
};

export default EditProvider;
