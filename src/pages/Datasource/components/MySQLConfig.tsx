import React from 'react';
import {Form, Input} from 'antd';

interface Config {
  url?: string;
  username?: string;
  password?: string;
}

interface DatabaseConfigProps {
  config?: Config;
  onChange?: (changedConfig: Config) => void;
}

const DatabaseConfig: React.FC<DatabaseConfigProps> = ({config, onChange}) => {
  const handleFieldChange = (changedValues: any) => {
    onChange({...config, ...changedValues});
  };

  return (
    <>
      <Form.Item name="dbKind" hidden/>
      <Form.Item
        name="url"
        label="Database URL"
        rules={[{required: true, message: 'Please input the database URL!'}]}
      >
        <Input placeholder="jdbc:mysql://localhost:3306/db_name"/>
      </Form.Item>
      <Form.Item name="username" label="Username">
        <Input/>
      </Form.Item>
      <Form.Item name="password" label="Password">
        <Input.Password/>
      </Form.Item>
    </>
  );
};

export default DatabaseConfig;
