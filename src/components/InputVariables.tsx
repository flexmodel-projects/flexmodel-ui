import React, { useState, useEffect, useCallback } from 'react';
import { Input, Button, Dropdown, Menu } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import {getVariables} from "../api/environment.ts";

interface InputVariablesProps {
  placeholder?: string;
}

const InputVariables: React.FC<InputVariablesProps> = ({ placeholder }) => {
  const [input, setInput] = useState<string>('');
  const [variables, setVariables] = useState<Record<string, any>>({});

  const reqVariables = useCallback(async () => {
    const result = await getVariables();
    setVariables(result);
  }, []);

  useEffect(() => {
    reqVariables();
  }, [reqVariables]);

  const variableKeys = [
    ...(Object.keys(variables['environment'] || {})),
    ...(Object.keys(variables['system'] || {})),
  ];

  const handleMenuClick = (item: { key: string }) => {
    setInput(`\${${item.key}}`);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {variableKeys.map((key) => (
        <Menu.Item key={key}>{key}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Input
      value={input}
      placeholder={placeholder}
      suffix={
        <Dropdown overlay={menu} trigger={['click']}>
          <Button size="small" type="link" icon={<DownOutlined />} />
        </Dropdown>
      }
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default InputVariables;
