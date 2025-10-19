import React from 'react';
import {useTranslation} from "react-i18next";
import type {IdentityProvider} from "@/types/identity-provider";
import {normalizeIdentityProvider} from "@/pages/IdentityProvider/utils";
import OIDCIdPForm from "@/pages/IdentityProvider/components/OIDCIdPForm";
import JsIdPForm from "@/pages/IdentityProvider/components/JsIdPForm.tsx";
import {Form} from 'antd';

interface IdpViewProps { data: IdentityProvider }

const IdpView: React.FC<IdpViewProps> = ({ data }) => {

  useTranslation();

  const flat = normalizeIdentityProvider(data);

  return (
    <>
      {flat.type === 'js' ? (
        <Form
          layout="vertical"
          variant="borderless"
          initialValues={flat}
          key={`${flat.name}-script`}
        >
          <JsIdPForm readOnly />
        </Form>
      ) : (
        <Form
          layout="vertical"
          variant="borderless"
          initialValues={flat}
          key={`${flat.name}-oidc`}
        >
          <OIDCIdPForm readOnly />
        </Form>
      )}
    </>
  );
};

export default IdpView;
