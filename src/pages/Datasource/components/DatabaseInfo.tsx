import React from 'react';
import { Descriptions } from 'antd';
import HidePassword from "../../../components/HidePassword.tsx";

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
  return (
    <Descriptions bordered column={1} items={[
      {
        key: 'Connection name',
        label: 'Connection name',
        children: datasource.name,
        span: 1,
      },
      {
        key: 'Connection type',
        label: 'Connection type',
        children: datasource.type,
        span: 1,
      },
      {
        key: 'Database type',
        label: 'Database type',
        children: datasource.config?.dbKind,
        span: 1,
      },
      {
        key: 'URL',
        label: 'URL',
        children: datasource.config?.url,
        span: 1,
      },
      ...(datasource.config?.username ? [{
        key: 'Username',
        label: 'Username',
        children: datasource.config.username,
        span: 1,
      }] : []),
      ...(datasource.config?.password ? [{
        key: 'Password',
        label: 'Password',
        children: <HidePassword text={datasource.config.password} />,
        span: 1,
      }] : []),
      {
        key: 'Create time',
        label: 'Create time',
        children: datasource.createdAt,
        span: 1,
      }
    ]} />
  );
};

export default DatabaseInfo;
