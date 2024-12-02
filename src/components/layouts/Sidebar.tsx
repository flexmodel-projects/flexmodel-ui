import React, { useEffect, useState } from "react";
import { Layout, Menu, Space } from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  ApiOutlined,
  CloudServerOutlined,
  ContainerOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  HomeOutlined,
  LineChartOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import styles from "./Sidebar.module.scss";

// 定义菜单项的类型
interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

const Sidebar: React.FC<{ defaultSelectedKey?: string }> = ({
  defaultSelectedKey = "1",
}) => {
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();
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
      label: t("api"),
      children: [
        {
          key: "/api-management",
          icon: <DeploymentUnitOutlined />,
          label: <Link to="/api-management">{t("api_management")}</Link>,
        },
        {
          key: "/api-document",
          icon: <FileTextOutlined />,
          label: <Link to="/api-document">{t("api_document")}</Link>,
        },
        {
          key: "/api-log",
          icon: <LineChartOutlined />,
          label: <Link to="/api-log">{t("api_log")}</Link>,
        },
      ],
    },
    {
      key: "data",
      icon: <CloudServerOutlined />,
      label: t("data"),
      children: [
        {
          key: "/datasource",
          icon: <DatabaseOutlined />,
          label: <Link to="/datasource">{t("data_source")}</Link>,
        },
        {
          key: "/modeling",
          icon: <ContainerOutlined />,
          label: <Link to="/modeling">{t("data_modeling")}</Link>,
        },
      ],
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

  // 获取当前路径
  const currentPath = location.pathname;

  // 根据当前路径计算需要展开的菜单项
  const getOpenKeys = (menuItems: MenuItem[]): string[] => {
    const keys: string[] = [];
    menuItems.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.key === currentPath) {
            keys.push(item.key);
          }
        });
      }
    });
    return keys;
  };

  // 更新展开的节点
  useEffect(() => {
    const keys = getOpenKeys(menuData);
    setOpenKeys(keys);
  }, [currentPath]);

  // 处理菜单项的点击
  const handleMenuClick = (key: string) => {
    console.log("handle menu click: ", key);
    setOpenKeys(getOpenKeys(menuData)); // 获取当前选中路径的父菜单并展开
  };

  // css-in-js vs css modules 当运行时css-in-js性能不足时，考虑编译时css-in-js

  return (
    <Layout.Sider
      theme="light"
      collapsed={true}
      className={[styles.root, "!w-14 !basis-14 !min-w-14"].join(" ")}
    >
      <Space className="logo-wrapper flex justify-center">
        <img src="/logo.png" width={40} alt="logo" />
      </Space>
      <Menu
        theme="light"
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys} // 处理手动展开/关闭
        items={menuData.map((item) => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children?.map((child) => ({
            key: child.key,
            icon: child.icon,
            label: child.label,
          })),
        }))}
        onClick={({ key }) => handleMenuClick(key)} // 处理菜单项点击
      />
    </Layout.Sider>
  );
};

export default Sidebar;
