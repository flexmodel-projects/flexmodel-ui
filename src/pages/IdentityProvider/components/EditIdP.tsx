import React, {useEffect} from 'react';
import {Form, Modal} from 'antd';
import {useTranslation} from "react-i18next";
import type {IdentityProvider} from "@/types/identity-provider";
import {normalizeIdentityProvider} from "@/pages/IdentityProvider/utils";
import OIDCIdPForm from "@/pages/IdentityProvider/components/OIDCIdPForm";
import JsIdPForm from "@/pages/IdentityProvider/components/JsIdPForm.tsx";

interface EditIdPProps {
  visible: boolean;
  data: IdentityProvider | null;
  onCancel: () => void;
  onConfirm: (form: any) => void;
}

const EditIdP: React.FC<EditIdPProps> = ({visible, data, onCancel, onConfirm}) => {

  const {t} = useTranslation();

  const [form] = Form.useForm();
  const watchedType = Form.useWatch?.('type', form);

  useEffect(() => {
    if (visible) {
      const flat = normalizeIdentityProvider(data || null);
      form.setFieldsValue(flat);
    }
  }, [visible, data, form]);

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
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        { (watchedType ?? normalizeIdentityProvider(data || null).type) === 'js' ? (
          <JsIdPForm />
        ) : (
          <OIDCIdPForm />
        )}
      </Form>
    </Modal>
  );
};

export default EditIdP;
