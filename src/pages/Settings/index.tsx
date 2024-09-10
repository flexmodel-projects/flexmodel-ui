import React from 'react';
import {Card, Tabs} from 'antd';
import About from './components/About.tsx';
import Variables from "./components/Variables.tsx"; // 替换为你的实际路径

const Settings: React.FC = () => {
  const items = [
    {
      key: '1',
      label: 'Variables',
      children: <Variables/>,
    },
    {
      key: '2',
      label: 'About',
      children: <About/>,
    },
  ];

  return (
    <Card>
      <Tabs tabPosition="left" items={items}/>
    </Card>
  );
};

export default Settings;
