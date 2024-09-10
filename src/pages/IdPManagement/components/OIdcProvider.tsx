import React from 'react';
import {Form} from 'antd';
import InputVariables from "../../../components/InputVariables.tsx";

interface OIdcProviderProps {
  provider: {
    type: string;
    issuer: string;
    clientId: string;
    clientSecret: string;
  };
  setProvider: (value: any) => void;
}

const OIdcProvider: React.FC<OIdcProviderProps> = ({provider, setProvider}) => {

  const handleFieldChange = (changedValue: Partial<OIdcProviderProps['provider']>) => {
    setProvider((prevProvider: any) => ({
      ...prevProvider,
      ...changedValue,
    }));
  };

  return (
    <Form
      layout="vertical"
      initialValues={provider}
      onValuesChange={(_, allValues) => handleFieldChange(allValues)}
    >
      {/* Issuer */}
      <Form.Item
        label="Issuer"
        name="issuer"
        rules={[{required: true, message: 'Issuer is required'}]}
      >
        <InputVariables placeholder="e.g. http://localhost:8080/realms/master" value={provider.issuer}/>
      </Form.Item>

      {/* Discovery endpoint */}
      {provider.issuer && (
        <Form.Item label="Discovery endpoint">
          {`${provider.issuer}/.well-known/openid-configuration`}
        </Form.Item>
      )}

      {/* Client ID */}
      <Form.Item
        label="Client ID"
        name="clientId"
        rules={[{required: true, message: 'Client ID is required'}]}
      >
        <InputVariables value={provider.clientId}/>
      </Form.Item>

      {/* Client Secret */}
      <Form.Item
        label="Client Secret"
        name="clientSecret"
        rules={[{required: true, message: 'Client Secret is required'}]}
      >
        <InputVariables value={provider.clientSecret}/>
      </Form.Item>
    </Form>
  );
};

export default OIdcProvider;
