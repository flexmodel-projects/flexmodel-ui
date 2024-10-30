import React from 'react';
import {Descriptions} from 'antd';
import HidePassword from "../../../components/HidePassword.tsx";
import {useTranslation} from "react-i18next";

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

const IdpInfo: React.FC<IdpInfoProps> = ({data}) => {

  const {t} = useTranslation();

  return (
    <Descriptions bordered column={1}>
      {/* Display name */}
      <Descriptions.Item label={t('idp_provider_name')}>{data.name}</Descriptions.Item>

      {/* Provider type */}
      <Descriptions.Item label={t('idp_provider_type')}>{data.provider?.type}</Descriptions.Item>

      {/* Issuer */}
      <Descriptions.Item label={t('idp_issuer')}>{data.provider?.issuer}</Descriptions.Item>

      {/* Discovery endpoint */}
      {data.provider?.issuer && (
        <Descriptions.Item label={t('idp_discovery_endpoint')}>
          <a href={`${data.provider.issuer}/.well-known/openid-configuration`} target="_blank">
            {`${data.provider.issuer}/.well-known/openid-configuration`}
          </a>
        </Descriptions.Item>
      )}

      {/* Client ID */}
      <Descriptions.Item label={t('idp_client_id')}>{data.provider?.clientId}</Descriptions.Item>

      {/* Client Secret */}
      <Descriptions.Item label={t('idp_client_secret')}>
        <HidePassword text={data.provider?.clientSecret}/>
      </Descriptions.Item>
    </Descriptions>
  );
};

export default IdpInfo;
