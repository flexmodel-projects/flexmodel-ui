import React from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from 'react-i18next';

// SensitiveText removed in unified form

interface Props { readOnly?: boolean }

const OIDCIdPForm: React.FC<Props> = ({ readOnly = false }) => {
  const { t } = useTranslation();

  const issuer = Form.useWatch?.('issuer');

  return (
    <>
      <Form.Item hidden name="type" initialValue="oidc">
        <Input />
      </Form.Item>
      <Form.Item
        name="name"
        label={t('idp_provider_name')}
        rules={[{ required: true }]}
      >
        <Input readOnly={readOnly} />
      </Form.Item>

      <Form.Item
        label={t('idp_issuer')}
        name="issuer"
        rules={[{ required: true }]}
      >
        <Input placeholder="e.g. http://localhost:8080/realms/master" readOnly={readOnly} />
      </Form.Item>

      {issuer && (
        <Form.Item label={t('idp_discovery_endpoint')}>
          {readOnly ? (
            <Input readOnly value={`${issuer}/.well-known/openid-configuration`} />
          ) : (
            `${issuer}/.well-known/openid-configuration`
          )}
        </Form.Item>
      )}

      <Form.Item
        label={t('idp_client_id')}
        name="clientId"
        rules={[{ required: true }]}
      >
        <Input readOnly={readOnly} />
      </Form.Item>

      <Form.Item
        label={t('idp_client_secret')}
        name="clientSecret"
        rules={[{ required: true }]}
      >
        <Input readOnly={readOnly} />
      </Form.Item>
    </>
  );
};

export default OIDCIdPForm;


