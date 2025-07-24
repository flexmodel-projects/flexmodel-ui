import React, {useEffect, useState} from 'react';
import {Menu, message} from "antd";
import About from "@/pages/Settings/components/About.tsx";
import Base from "@/pages/Settings/components/Base.tsx";
import Proxy from "@/pages/Settings/components/Proxy.tsx";
import {getSettings, saveSettings as reqSaveSettings} from "@/services/settings.ts";
import Security from "@/pages/Settings/components/Security.tsx";
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
    <div className="flex w-full h-full pt-4 pb-4 bg-white dark:bg-[#18181c]">
      <div className="w-[224px] border-r border-[#f5f5f5] dark:border-[#23232a] bg-white dark:bg-[#23232a]">
        <Menu
          mode="inline"
          selectedKeys={[initConfig.selectKey]}
          onClick={({ key }) => {
            setInitConfig({
              ...initConfig,
              selectKey: key as SettingsStateKeys,
            });
          }}
          items={getMenu()}
          className="bg-white dark:bg-[#23232a] text-black dark:text-[#f5f5f5]"
        />
      </div>
      <div className="flex-1 px-10 py-2 bg-white dark:bg-[#18181c]">
        <div className="mb-3 font-normal text-[20px] leading-7 text-[rgba(0,0,0,0.88)] dark:text-[#f5f5f5]">
          {menuMap[initConfig.selectKey]}
        </div>
        {renderChildren()}
      </div>
    </div>
  );
};

export default Settings;
