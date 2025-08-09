import React, {useEffect, useState} from "react";
import {Card, Menu, message} from "antd";
import About from "@/pages/Settings/components/About";
import Base from "@/pages/Settings/components/Base";
import Proxy from "@/pages/Settings/components/Proxy";
import {getSettings, saveSettings as reqSaveSettings,} from "@/services/settings.ts";
import Security from "@/pages/Settings/components/Security";
import {useTranslation} from "react-i18next";
import type {Settings} from "@/types/settings";
import Title from "antd/es/typography/Title";

type OnChangeHandler = (data: Partial<Settings>) => void;

const Settings: React.FC = () => {
  const { t } = useTranslation();
  type SettingsStateKeys = "base" | "security" | "proxy" | "about";

  type SettingsState = {
    mode: "inline" | "horizontal";
    selectKey: SettingsStateKeys;
  };

  const menuMap: Record<SettingsStateKeys, React.ReactNode> = {
    base: t("settings_basic_settings"),
    /*variables: 'Variables',*/
    security: t("settings_security"),
    proxy: t("settings_proxy"),
    about: t("settings_about"),
  };

  const renderChildren = (onChange: OnChangeHandler) => {
    const { selectKey } = initConfig;
    switch (selectKey) {
      case "base":
        return <Base settings={settings} onChange={onChange} />;
      case "security":
        return <Security settings={settings} onChange={onChange} />;
      case "proxy":
        return <Proxy settings={settings} onChange={onChange} />;
      /*case 'variables':
        return <Variables/>;*/
      case "about":
        return <About />;
      default:
        return null;
    }
  };

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: "inline",
    selectKey: "base",
  });

  const getMenu = () => {
    return (Object.keys(menuMap) as SettingsStateKeys[]).map((item) => ({
      key: item,
      label: menuMap[item],
    }));
  };

  const [settings, setSettings] = useState<Settings | undefined>(undefined);

  useEffect(() => {
    getSettings().then((res) => setSettings(res));
  }, []);

  const saveSettings: OnChangeHandler = (data) => {
    reqSaveSettings(data as Settings).then(() =>
      message.success(t("form_save_success"))
    );
    setSettings((prev) => ({ ...prev, ...data } as Settings));
  };

  return (
    <Card
      style={{ width: "100%", height: "100%" }}
      styles={{ body: { height: "100%" } }}
    >
      <div className="flex w-full h-full pt-4 pb-4">
        <div className="w-[224px] h-full settings-menu-wrapper">
          <Menu
            className="h-full"
            mode="inline"
            selectedKeys={[initConfig.selectKey]}
            onClick={({ key }) => {
              setInitConfig({
                ...initConfig,
                selectKey: key as SettingsStateKeys,
              });
            }}
            items={getMenu()}
          />
        </div>
        <div className="flex-1 px-10 py-2">
          <Title
            level={3}
            className="description"
            style={{ color: "var(--ant-color-text)" }}
          >
            {menuMap[initConfig.selectKey]}
          </Title>
          {renderChildren(saveSettings)}
        </div>
      </div>
    </Card>
  );
};

export default Settings;
