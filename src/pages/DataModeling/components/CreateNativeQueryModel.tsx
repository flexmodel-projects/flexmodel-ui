import React from 'react';
import {Button, Drawer, Form, Input, notification} from 'antd';
import TextArea from 'antd/es/input/TextArea';
import {createModel} from '@/services/model.ts';
import {useTranslation} from 'react-i18next';


interface CreateNativeQueryModelProps {
  visible: boolean;
  datasource: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CreateNativeQueryModel: React.FC<CreateNativeQueryModelProps> = ({
  visible,
  datasource,
  onConfirm,
  onCancel,
}) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const queryData = {
        ...values,
        type: 'NATIVE_QUERY',
      };
      await createModel(datasource, queryData);
      notification.success({message: t('form_save_success')});
      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  // 紧凑主题样式
  const formStyle = {

  };

  return (
    <Drawer
      title={t('new_native_query')}
      open={visible}
      onClose={onCancel}
      width={600}
      footer={
        <div style={{textAlign: 'right'}}>
          <Button onClick={onCancel} style={{marginRight: 8}}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} type="primary">
            {t('confirm')}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" style={formStyle}>
        <Form.Item name="name" label={t('name')} rules={[{required: true}]}>
          <Input size="small"/>
        </Form.Item>
        <Form.Item name="statement" label={t('statement')} rules={[{required: true}]}>
          <TextArea rows={4} size="small"/>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateNativeQueryModel;

