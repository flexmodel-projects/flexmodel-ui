import React, {useState} from "react";
import {Layout, Menu} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {
  ApiOutlined,
  CloudServerOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import styles from "./Sidebar.module.scss";

const Sidebar: React.FC<{ defaultSelectedKey?: string }> = () => {
  const { t } = useTranslation();
  const history = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

  // 菜单数据
  const menuData = [
    {
      key: "/",
      icon: <HomeOutlined />,
      label: t("overview"),
    },
    {
      key: "/api",
      icon: <ApiOutlined />,
      label: t("api"),
    },
    {
      key: "/data",
      icon: <CloudServerOutlined />,
      label: t("data"),
    },
    {
      key: "/identity-providers",
      icon: <UserOutlined />,
      label: t("identity_providers"),
    },
    {
      key: "/settings",
      icon: <SettingOutlined />,
      label: t("settings"),
    },
  ];

  // 切换收起/展开
  const toggleCollapsed = () => {
    setCollapsed((prev) => !prev);
  };

  // 菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    if (location.pathname !== key) {
      history(key);
    }
  };

  return (
    <Layout.Sider
      theme="light"
      collapsed={collapsed}
      collapsedWidth={56}
      width={180}
      className={[styles.root, "!w-18 !basis-18 !min-w-18"].join(" ")}
      trigger={null}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          style={{ flex: 1, borderRight: 0 }}
          items={menuData}
        />
        <div style={{ padding: 8, textAlign: "center" }}>
          <span onClick={toggleCollapsed} style={{ cursor: "pointer", fontSize: 18 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
