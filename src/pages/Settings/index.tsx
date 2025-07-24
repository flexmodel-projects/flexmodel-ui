import React, {useEffect, useState} from 'react';
import {Menu, message} from "antd";
import About from "@/pages/Settings/components/About.tsx";
import Base from "@/pages/Settings/components/Base.tsx";
import Proxy from "@/pages/Settings/components/Proxy.tsx";
import {getSettings, saveSettings as reqSaveSettings} from "@/services/settings.ts";
import Security from "@/pages/Settings/components/Security.tsx";
import {useTranslation} from "react-i18next";
import type {Settings} from '@/types/settings';

type OnChangeHandler = (data: Partial<Settings>) => void;

const Settings: React.FC = () => {
  const {t} = useTranslation();
  type SettingsStateKeys = 'base' | 'security' | 'proxy' | 'about';

  type SettingsState = {
    mode: 'inline' | 'horizontal';
    selectKey: SettingsStateKeys;
  };

  const menuMap: Record<SettingsStateKeys, React.ReactNode> = {
    base: t('settings_basic_settings'),
    /*variables: 'Variables',*/
    security: t('settings_security'),
    proxy: t('settings_proxy'),
    about: t('settings_about'),
  };

  const renderChildren = (onChange: OnChangeHandler) => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'base':
        return <Base settings={settings} onChange={onChange}/>;
      case 'security':
        return <Security settings={settings} onChange={onChange}/>;
      case 'proxy':
        return <Proxy settings={settings} onChange={onChange}/>;
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
    return (Object.keys(menuMap) as SettingsStateKeys[]).map((item) => ({
      key: item,
      label: menuMap[item],
    }));
  };

  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    getSettings().then(res => setSettings(res));
  }, []);

  const saveSettings: OnChangeHandler = (data) => {
    reqSaveSettings(data as Settings)
      .then(() => message.success(t('form_save_success')));
    setSettings(prev => ({ ...prev, ...data } as Settings));
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
        {renderChildren(saveSettings)}
      </div>
    </div>
  );
};

export default Settings;
