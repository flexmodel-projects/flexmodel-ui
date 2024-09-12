import React, {useState} from 'react';
import {Button, Col, Drawer, Form, Input, message, Radio, Row, Steps} from 'antd';
import OIdcProvider from "./OIdcProvider.tsx";
import {createIdentityProvider} from "../../../api/identity-provider.ts";
import IdPInfo from "./IdPInfo.tsx";
import {css} from "@emotion/css";

interface ProviderForm {
  name: string;
  provider: {
    type: string;
    issuer: string;
    clientId: string;
    clientSecret: string;
  };
}

interface CreateProviderProps {
  visible: boolean;
  onClose: () => void;
  onChange: (provider: any) => void;
}

const CreateProvider: React.FC<CreateProviderProps> = ({visible, onClose, onChange}) => {
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<ProviderForm>({
    name: '',
    provider: {
      type: 'oidc',
      issuer: '',
      clientId: '',
      clientSecret: ''
    },
  });

  const next = () => setCurrentStep((prev) => Math.min(prev + 1, 2));
  const prev = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleCreateProvider = async () => {
    try {
      const values = await form.validateFields();
      const newProvider = {...formData, ...values};
      const res = await createIdentityProvider(newProvider);
      message.success('Provider created successfully');
      next();
      onChange(res);
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
        onValuesChange={(changedValues) => setFormData((prev) => ({...prev, ...changedValues}))}
        style={{marginTop: 24}}
      >
        {currentStep === 0 && (
          <Form.Item label="Please select your IdP to create">
            <Radio.Group value={formData.provider.type}>
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

            {formData.provider.type === 'oidc' && <OIdcProvider provider={formData.provider}
                                                                setProvider={value => console.log(value)}/>}
          </>
        )}

        {currentStep === 2 && (
          <Row justify="center">
            <Col span={24} style={{textAlign: 'center'}}>
              <p>Created successfully</p>
              <IdPInfo data={formData}/>
              <Button type="primary" style={{marginTop: 12}} onClick={onClose}>
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
