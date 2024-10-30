import React from 'react';
import { Form, Input } from 'antd';
import {useTranslation} from "react-i18next";

interface Config {
  url?: string;
  username?: string;
  password?: string;
}

interface DatabaseConfigProps {
  config?: Config;
  onChange?: (changedConfig: Config) => void;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = () => {

  const {t} = useTranslation();

  return (
    <>
      <Form.Item name="dbKind" hidden/>
      <Form.Item
        name="url"
        label={t('connect_database_url')}
        rules={[{required: true}]}
      >
        <Input placeholder="jdbc:mysql://localhost:3306/db_name"/>
      </Form.Item>
      <Form.Item name="username" label={t('username')}>
        <Input/>
      </Form.Item>
      <Form.Item name="password" label={t('password')}>
        <Input.Password/>
      </Form.Item>
    </>
  );
};

export default DatabaseConfig;
