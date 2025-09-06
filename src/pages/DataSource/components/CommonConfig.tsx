import React from 'react';
import {Form, Input} from 'antd';
import {useTranslation} from "react-i18next";

interface Config {
  url?: string;
  username?: string;
  password?: string;
}

interface DatabaseConfigProps {
  config?: Config;
  onChange?: (changedConfig: Config) => void;
  readOnly?: boolean;
}

const CommonConfig: React.FC<DatabaseConfigProps> = ({ readOnly = false }) => {

  const {t} = useTranslation();

  return (
    <>
      <Form.Item name="dbKind" hidden/>
      <Form.Item
        name="url"
        label={t('connect_database_url')}
        rules={[{required: true}]}
      >
        <Input placeholder="jdbc:mysql://localhost:3306/db_name" readOnly={readOnly}/>
      </Form.Item>
      <Form.Item name="username" label={t('username')}>
        <Input readOnly={readOnly}/>
      </Form.Item>
      <Form.Item name="password" label={t('password')}>
        <Input.Password readOnly={readOnly}/>
      </Form.Item>
    </>
  );
};

export default CommonConfig;
