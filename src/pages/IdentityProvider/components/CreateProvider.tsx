import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Steps} from 'antd';
import {createIdentityProvider} from "../../../api/identity-provider.ts";
import IdPInfo from "./IdPInfo.tsx";
import {css} from "@emotion/css";

interface CreateProviderProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (provider: any) => void;
}

const CreateProvider: React.FC<CreateProviderProps> = ({visible, onClose, onConfirm}) => {
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
      const newProvider = {name: values.name, provider: values};
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

  const segmentTitle = css`
    font-size: 16px;
    font-weight: bold;
    padding-bottom: 10px;
  `;

  return (
    <Drawer
      title="New provider"
      width="50%"
      visible={visible}
      onClose={onClose}
      footer={
        <>
          {currentStep !== 0 && currentStep !== 2 && (
            <Button onClick={prev} style={{marginRight: 8}}>
              Go back
            </Button>
          )}
          {currentStep === 0 && (
            <Button type="primary" onClick={next}>
              Select provider
            </Button>
          )}
          {currentStep === 1 && (
            <Button type="primary" onClick={handleCreateProvider}>
              Create provider
            </Button>
          )}
        </>
      }
    >
      <Steps current={currentStep} size="small">
        <Steps.Step title="Select provider"/>
        <Steps.Step title="Create provider"/>
        <Steps.Step title="Success"/>
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
          <Form.Item name="type" initialValue="oidc" label="Please select your IdP to create">
            <Radio.Group name="type">
              <div className={segmentTitle}>User-defined</div>
              <Radio value="oidc">OpenID Connect (oidc)</Radio>
              <div className={segmentTitle}>Social</div>
              <Radio value="github" disabled>
                Github (github)
              </Radio>
            </Radio.Group>
          </Form.Item>
        )}

        {currentStep === 1 && (
          <>
            <Form.Item
              name="name"
              label="Display name"
              rules={[{required: true, message: 'Please enter the display name'}]}
            >
              <Input/>
            </Form.Item>

            <Form.Item
              label="Issuer"
              name="issuer"
              rules={[{required: true, message: 'Issuer is required'}]}
            >
              <Input placeholder="e.g. http://localhost:8080/realms/master"/>
            </Form.Item>

            {/* Discovery endpoint */}
            {formData.issuer && <Form.Item label="Discovery endpoint">
              {formData.issuer}/.well-known/openid-configuration
            </Form.Item>}


            {/* Client ID */}
            <Form.Item
              label="Client ID"
              name="clientId"
              rules={[{required: true, message: 'Client ID is required'}]}
            >
              <Input/>
            </Form.Item>

            {/* Client Secret */}
            <Form.Item
              label="Client Secret"
              name="clientSecret"
              rules={[{required: true, message: 'Client Secret is required'}]}
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
