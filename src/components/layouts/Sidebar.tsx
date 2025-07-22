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

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(true);

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

  const handleMenuClick = ({ key }: { key: string }) => {
    if (location.pathname !== key) {
      navigate(key);
    }
  };

  return (
    <Layout.Sider
      theme="light"
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      collapsedWidth={56}
      width={180}
      trigger={null}
      style={{
        minHeight: "100vh",
        transition: "width 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: "2px 0 8px 0 rgba(0,0,0,0.04)",
        zIndex: 10
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ height: 64, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src="/logo.png" width={40} alt="logo" />
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          inlineCollapsed={collapsed}
          style={{ flex: 1, borderRight: 0 }}
          items={menuData}
        />
        <div style={{ padding: 8, textAlign: "center" }}>
          <span onClick={() => setCollapsed(!collapsed)} style={{ cursor: "pointer", fontSize: 18 }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </span>
        </div>
      </div>
    </Layout.Sider>
  );
};

export default Sidebar;
