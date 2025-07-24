import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Steps} from 'antd';
import {createIdentityProvider} from "@/services/identity-provider.ts";
import IdPInfo from "@/pages/IdentityProvider/components/IdPInfo.tsx";
import {useTranslation} from "react-i18next";

interface CreateProviderProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (provider: any) => void;
}

const CreateProvider: React.FC<CreateProviderProps> = ({visible, onClose, onConfirm}) => {

  const {t} = useTranslation();

  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: '',
    type: 'oidc',
    issuer: '',
    clientId: '',
    clientSecret: ''
  });

  const next = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleCreateProvider = async () => {
    try {
      const values = await form.validateFields();
      const newProvider = {
        name: values.name,
        provider: values,
        createdAt: '',
        updatedAt: ''
      };
      const res = await createIdentityProvider(newProvider);
      setFormData(res);
      message.success('Provider created successfully');
      next();
      onConfirm(res);
    } catch (error) {
      console.log(error)
      message.error('Failed to create provider');
    }
  };

  const segmentTitle = "text-[16px] font-bold pb-[10px]";

  return (
    <Drawer
      title={t('idp_new_provider')}
      width="50%"
      visible={visible}
      onClose={onClose}
      footer={
        <>
          {currentStep !== 0 && currentStep !== 2 && (
            <Button onClick={prev} style={{marginRight: 8}}>
              {t('idp_btn_go_back')}
            </Button>
          )}
          {currentStep === 0 && (
            <Button type="primary" onClick={next}>
              {t('idp_btn_select_provider')}
            </Button>
          )}
          {currentStep === 1 && (
            <Button type="primary" onClick={handleCreateProvider}>
              {t('idp_btn_create_provider')}
            </Button>
          )}
        </>
      }
    >
      <Steps current={currentStep} size="small">
        <Steps.Step title={t('idp_step_select_provider')}/>
        <Steps.Step title={t('idp_step_create_provider')}/>
        <Steps.Step title={t('idp_step_success')}/>
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(changedValues) => setFormData((prev: any) => ({...prev, ...changedValues}))}
        style={{marginTop: 24}}
      >
        <Form.Item hidden name="type" initialValue="oidc">
          <Input/>
        </Form.Item>
        {currentStep === 0 && (
          <Form.Item name="type" initialValue="oidc" label={t('idp_create_tips')}>
            <Radio.Group name="type">
              <div className={segmentTitle}>{t('idp_user_defined')}</div>
              <Radio value="oidc">OpenID Connect (oidc)</Radio>
              <div className={segmentTitle}>{t('idp_social')}</div>
              <Radio value="github" disabled>
                Github (github)
              </Radio>
              <Radio value="google" disabled>
                Google (google)
              </Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              name="name"
              label={t('idp_provider_name')}
              rules={[{required: true}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label={t('idp_issuer')}
              name="issuer"
              rules={[{required: true}]}
            >
              <Input placeholder="e.g. http://localhost:8080/realms/master"/>
            </Form.Item>

            {/* Discovery endpoint */}
            {formData.issuer && <Form.Item label="Discovery endpoint">
              {formData.issuer}/.well-known/openid-configuration
            </Form.Item>}


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
          </>
        )}

        {currentStep === 2 && (
          <Row justify="center">
            <Col span={24} style={{textAlign: 'center'}}>
              <p>Created successfully</p>
              <IdPInfo data={formData}/>
              <Button type="primary" style={{marginTop: 12}} onClick={() => {
                onClose();
                setCurrentStep(0);
              }}>
                Close
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </Drawer>
  );
};

export default CreateProvider;
