import React, {useEffect, useState} from 'react';
import {css} from "@emotion/css";
import {Menu, message} from "antd";
import About from "./components/About.tsx";
import Base from "./components/Base.tsx";
import Proxy from "./components/Proxy.tsx";
import {getSettings, saveSettings as reqSaveSettings} from "../../api/settings.ts";
import Security from "./components/Security.tsx";
import {useTranslation} from "react-i18next";

const Settings: React.FC = () => {
  const {t} = useTranslation();
  type SettingsStateKeys = 'base' | 'security' | 'proxy' | 'about';

  type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
  };

  const menuMap: Record<string, React.ReactNode> = {
    base: t('settings_basic_settings'),
    /*variables: 'Variables',*/
    security: t('settings_security'),
    proxy: t('settings_proxy'),
    about: t('settings_about'),
  };

  const renderChildren = () => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'base':
        return <Base settings={settings} onChange={data => saveSettings(data)}/>;
      case 'security':
        return <Security settings={settings} onChange={data => saveSettings(data)}/>;
      case 'proxy':
        return <Proxy settings={settings} onChange={data => saveSettings(data)}/>;
      /*case 'variables':
        return <Variables/>;*/
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

  const [settings, setSettings] = useState<any>();

  useEffect(() => {
    getSettings().then(res => setSettings(res));
  }, []);

  const saveSettings = (data: object) => {
    reqSaveSettings(data)
      .then(() => message.success(t('form_save_success')));
    setSettings({...settings, ...data});
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
        font-weight: 400;
        font-size: 20px;
        line-height: 28px;
        `}>{menuMap[initConfig.selectKey]}</div>
        {renderChildren()}
      </div>
    </div>
  );
};

export default Settings;
