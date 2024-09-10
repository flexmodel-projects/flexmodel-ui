import React from 'react';
import { Descriptions } from 'antd';
import HidePassword from "../../../components/HidePassword.tsx";

interface IdpInfoProps {
  data: {
    name: string;
    provider?: {
      type: string;
      issuer: string;
      clientId: string;
      clientSecret: string;
    };
  };
}

const IdpInfo: React.FC<IdpInfoProps> = ({ data }) => {
  return (
    <Descriptions bordered column={1}>
      {/* Display name */}
      <Descriptions.Item label="Display name">{data.name}</Descriptions.Item>

      {/* Provider type */}
      <Descriptions.Item label="Provider type">{data.provider?.type}</Descriptions.Item>

      {/* Issuer */}
      <Descriptions.Item label="Issuer">{data.provider?.issuer}</Descriptions.Item>

      {/* Discovery endpoint */}
      {data.provider?.issuer && (
        <Descriptions.Item label="Discovery endpoint">
          {`${data.provider.issuer}/.well-known/openid-configuration`}
        </Descriptions.Item>
      )}

      {/* Client ID */}
      <Descriptions.Item label="Client ID">{data.provider?.clientId}</Descriptions.Item>

      {/* Client Secret */}
      <Descriptions.Item label="Client Secret">
        <HidePassword text={data.provider?.clientSecret} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export default IdpInfo;
