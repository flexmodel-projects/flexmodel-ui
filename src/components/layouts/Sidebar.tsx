import React, {useState} from "react";
import {Layout} from "antd";
import {Link} from "react-router-dom";
import {ApiOutlined, CloudServerOutlined, HomeOutlined, SettingOutlined, UserOutlined,} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import styles from "./Sidebar.module.scss";

// 定义菜单项的类型
interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

const Sidebar: React.FC<{ defaultSelectedKey?: string }> = () => {
  const [currKey, setCurrKey] = useState<string>("/");
  const { t } = useTranslation();

  // 菜单数据
  const menuData: MenuItem[] = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: <Link to="/">{t("overview")}</Link>,
    },
    {
      key: "api",
      icon: <ApiOutlined />,
      label: <Link to="/api">{t("api")}</Link>,
    },
    {
      key: "data",
      icon: <CloudServerOutlined />,
      label: <Link to="/data">{t("data")}</Link>,
    },
    {
      key: "/identity-providers",
      icon: <UserOutlined />,
      label: <Link to="/identity-providers">{t("identity_providers")}</Link>,
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">{t("settings")}</Link>,
    },
  ];

  // 处理菜单项的点击
  const handleMenuClick = (key: string) => {
    console.log("handle menu click: ", key);
    setCurrKey(key);
  };

  // css-in-js vs css modules 当运行时css-in-js性能不足时，考虑编译时css-in-js

  return (
    <Layout.Sider
      theme="light"
      collapsed={true}
      className={[styles.root, "!w-18 !basis-18 !min-w-18"].join(" ")}
    >
      {menuData.map((item) => (
        <div
          className={[
            "menu-item",
            currKey === item.key ? "menu-item-selected" : "",
          ].join(" ")}
          key={item.key}
          onClick={() => handleMenuClick(item.key)}
        >
          <span>{item.icon}</span>
          <span>{item.label}</span>
        </div>
      ))}
    </Layout.Sider>
  );
};

export default Sidebar;
