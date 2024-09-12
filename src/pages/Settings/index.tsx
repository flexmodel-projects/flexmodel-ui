import React, {useState} from 'react';
import {css} from "@emotion/css";
import {Menu} from "antd";
import About from "./components/About.tsx";
import Variables from "./components/Variables.tsx";

const Settings: React.FC = () => {
  type SettingsStateKeys = 'base' | 'variables' | 'about';

  type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
  };

  const menuMap: Record<string, React.ReactNode> = {
    base: 'Basic Settings',
    variables: 'Variables',
    about: 'About',
  };

  const renderChildren = () => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'base':
        return <About/>;
      case 'variables':
        return <Variables/>;
      case 'about':
        return <About/>;
      default:
        return null;
    }
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    selectKey: 'base',
  });

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => ({key: item, label: menuMap[item]}));
  };

  return (
    <div className={css`
      display: -webkit-box;
      display: -webkit-flex;
      display: -ms-flexbox;
      display: flex;
      width: 100%;
      height: 100%;
      padding-top: 16px;
      padding-bottom: 16px;
      background-color: #ffffff;
    `}>
      <div className={css`
       width: 224px;
       border-right: 1px solid rgba(5, 5, 5, 0.06);
    `}>
        <Menu
          mode="inline"
          selectedKeys={[initConfig.selectKey]}
          onClick={({key}) => {
            setInitConfig({
              ...initConfig,
              selectKey: key as SettingsStateKeys,
            });
          }}
          items={getMenu()}
        />
      </div>
      <div className={css`
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      padding: 8px 40px;
      `}>
        <div className={css`
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.88);
        font-weight: 500;
        font-size: 20px;
        line-height: 28px;
        `}>{menuMap[initConfig.selectKey]}</div>
        {renderChildren()}
      </div>
    </div>
  );
};

export default Settings;
