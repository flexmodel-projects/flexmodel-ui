import React from 'react';
import { Descriptions, Typography } from 'antd';
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
    <Descriptions bordered column={1}>
      <Descriptions.Item label="Connection name">{datasource.name}</Descriptions.Item>
      <Descriptions.Item label="Connection type">{datasource.type}</Descriptions.Item>
      <Descriptions.Item label="Database type">{datasource.config?.dbKind}</Descriptions.Item>
      <Descriptions.Item label="URL">{datasource.config?.url}</Descriptions.Item>
      {datasource.config?.username && (
        <Descriptions.Item label="Username">{datasource.config.username}</Descriptions.Item>
      )}
      {datasource.config?.password && (
        <Descriptions.Item label="Password">
          <HidePassword text={datasource.config.password} />
        </Descriptions.Item>
      )}
      <Descriptions.Item label="Create time">{datasource.createdAt}</Descriptions.Item>
    </Descriptions>
  );
};

export default DatabaseInfo;
