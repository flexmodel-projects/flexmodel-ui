import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Steps} from 'antd';
import {createIdentityProvider} from "@/services/identity-provider.ts";
import {useTranslation} from "react-i18next";
import OIDCIdPForm from "@/pages/IdentityProvider/components/OIDCIdPForm";
import JsIdPForm from "@/pages/IdentityProvider/components/JsIdPForm.tsx";
import GroovyIdPForm from "@/pages/IdentityProvider/components/GroovyIdPForm.tsx";

interface CreateIdPProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (provider: any) => void;
}

const CreateIdP: React.FC<CreateIdPProps> = ({ open, onClose, onConfirm }) => {

  const { t } = useTranslation();

  const [form] = Form.useForm();
  const JAVASCRIPT_TEMPLATE = `/**
 * Identity Provider Script Template
 * Implement authenticate(request) to return an object:
 *   { success: boolean, user?: { id: string; name?: string; roles?: string[] }, message?: string }
 * You can read headers via request.headers and query via request.query
 */
export async function authenticate(request) {
  // Example: simple token check from header
  const auth = request.headers['authorization'] || request.headers['Authorization'];
  if (!auth || !auth.startsWith('Bearer ')) {
    return { success: false, message: 'Missing bearer token' };
  }
  const token = auth.substring('Bearer '.length);
  // TODO: verify token, fetch user, etc.
  if (token === 'demo-token') {
    return { success: true, user: { id: 'demo', name: 'Demo User', roles: ['user'] } };
  }
  return { success: false, message: 'Invalid token' };
}
`;

  const GROOVY_TEMPLATE = `/**
 * Identity Provider Groovy Script Template
 * Implement authenticate(request) to return an object:
 *   [success: boolean, user: [id: string, name?: string, roles?: string[]], message?: string]
 * You can read headers via request.headers and query via request.query
 */
def authenticate(request) {
    // Example: simple token check from header
    def auth = request.headers['authorization'] ?: request.headers['Authorization']
    if (!auth || !auth.startsWith('Bearer ')) {
        return [success: false, message: 'Missing bearer token']
    }
    def token = auth.substring('Bearer '.length)
    // TODO: verify token, fetch user, etc.
    if (token == 'demo-token') {
        return [success: true, user: [id: 'demo', name: 'Demo User', roles: ['user']]]
    }
    return [success: false, message: 'Invalid token']
}
`;
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    name: '',
    type: 'oidc',
    issuer: '',
    clientId: '',
    clientSecret: '',
    script: ''
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
      open={open}
      onClose={onClose}
      footer={
        <>
          {currentStep !== 0 && currentStep !== 2 && (
            <Button onClick={prev} style={{ marginRight: 8 }}>
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
        <Steps.Step title={t('idp_step_select_provider')} />
        <Steps.Step title={t('idp_step_create_provider')} />
        <Steps.Step title={t('idp_step_success')} />
      </Steps>

      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
        onValuesChange={(changedValues) => {
          setFormData((prev: any) => {
            const next = { ...prev, ...changedValues };
            if (changedValues.type === 'js' && !next.script) {
              next.script = JAVASCRIPT_TEMPLATE;
              form.setFieldsValue({ script: JAVASCRIPT_TEMPLATE });
            } else if (changedValues.type === 'groovy' && !next.script) {
              next.script = GROOVY_TEMPLATE;
              form.setFieldsValue({ script: GROOVY_TEMPLATE });
            }
            return next;
          });
        }}
        style={{ marginTop: 24 }}
      >
        <Form.Item hidden name="type" initialValue="oidc">
          <Input />
        </Form.Item>
        {currentStep === 0 && (
          <Form.Item name="type" initialValue="oidc" label={t('idp_create_tips')}>
            <Radio.Group name="type">
              <div className={segmentTitle}>{t('idp_user_defined')}</div>
              <Radio value="oidc">OpenID Connect (oidc)</Radio>
              <Radio value="js">{t('idp_javascript')} (js)</Radio>
              <Radio value="groovy">{t('idp_groovy')} (groovy)</Radio>
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

        {currentStep === 1 && formData.type === 'oidc' && (
          <OIDCIdPForm />
        )}
        {currentStep === 1 && formData.type === 'js' && (
          <JsIdPForm />
        )}
        {currentStep === 1 && formData.type === 'groovy' && (
          <GroovyIdPForm />
        )}

        {currentStep === 2 && (
          <Row justify="center">
            <Col span={24} style={{ textAlign: 'center' }}>
              <p>Created successfully</p>
              <Form
                layout="horizontal"
                labelCol={{ style: { width: 160 } }}
                colon={false}
                variant="borderless"
                initialValues={formData}
              >
                {formData.type === 'oidc' && (
                  <OIDCIdPForm readOnly />
                )}
                {formData.type === 'js' && (
                  <JsIdPForm readOnly />
                )}
                {formData.type === 'groovy' && (
                  <GroovyIdPForm readOnly />
                )}
              </Form>
              <Button type="primary" style={{ marginTop: 12 }} onClick={() => {
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

export default CreateIdP;
