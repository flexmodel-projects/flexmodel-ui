import React from 'react';
import {Descriptions} from 'antd';
import SensitiveText from "@/components/SensitiveText.tsx";
import {useTranslation} from "react-i18next";

interface Datasource {
  name: string;
  type: string;
  config?: {
    dbKind?: string;
    url?: string;
    username?: string;
    password?: string;
  };
  createdAt: string;
}

interface DatabaseInfoProps {
  datasource: Datasource;
}

const DatabaseInfo: React.FC<DatabaseInfoProps> = ({ datasource }) => {
  const { t } = useTranslation();

  return (
    <Descriptions
      bordered
      column={1}
      size="default"
      style={{ width: '100%' }}
      items={[
        {
          key: 'Connection name',
          label: t('connection_name'),
          children: datasource.name,
          span: 1,
        },
        {
          key: 'Connection type',
          label: t('connection_type'),
          children: datasource.type,
          span: 1,
        },
        {
          key: 'Database type',
          label: t('database_type'),
          children: datasource.config?.dbKind,
          span: 1,
        },
        {
          key: 'URL',
          label: t('url'),
          children: datasource.config?.url,
          span: 1,
        },
        ...(datasource.config?.username ? [{
          key: 'Username',
          label: t('username'),
          children: datasource.config.username,
          span: 1,
        }] : []),
        ...(datasource.config?.password ? [{
          key: 'Password',
          label: t('password'),
          children: <SensitiveText text={datasource.config.password} />,
          span: 1,
        }] : []),
        ...(datasource.createdAt ? [{
          key: 'Create time',
          label: t('create_time'),
          children: datasource.createdAt,
          span: 1,
        }] : []),
      ]}
    />
  );
};

export default DatabaseInfo;
