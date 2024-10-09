import * as React from 'react';
import { useState } from 'react';
import { Col, Layout, Menu, Row } from 'antd';
import * as Icons from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Sidebar.css';
import {
  ApiOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";

interface SidebarProps {
  defaultSelectedKey?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ defaultSelectedKey = "1" }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mode, setMode] = useState<"vertical" | "inline" | "horizontal" | undefined>("inline");

  const toggle = () => {
    setCollapsed(!collapsed);
    setMode(collapsed ? "inline" : "vertical");
  };

  return (
    <Layout.Sider collapsible collapsed={collapsed} onCollapse={toggle}>
      <div className="ant-layout-logo">
        <Row align="middle">
          <Col>
            <img src="/logo.svg" width="40px" alt="logo" />
          </Col>
          {!collapsed && (
            <Col>
              <span style={{ fontSize: "20px", padding: '10px', color: "#eee" }}>Flexmodel</span>
            </Col>
          )}
        </Row>
      </div>
      <Menu theme="dark" mode={mode} defaultSelectedKeys={[defaultSelectedKey]}>
        <Menu.SubMenu key="api" icon={<ApiOutlined />} title="API">
          <Menu.Item key="/api-management">
            <Link to="/api-management">
              <DeploymentUnitOutlined />
              <span className="nav-text">API Management</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/api-document">
            <Link to="/api-document">
              <FileTextOutlined />
              <span className="nav-text">API Document</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/api-log">
            <Link to="/api-log">
              <LineChartOutlined />
              <span className="nav-text">API Log</span>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.SubMenu key="data" icon={<DatabaseOutlined />} title="Data">
          <Menu.Item key="/datasource">
            <Link to="/datasource">
              <Icons.FileOutlined />
              <span className="nav-text">Data source</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/modeling">
            <Link to="/modeling">
              <Icons.FileOutlined />
              <span className="nav-text">Data modeling</span>
            </Link>
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item key="/identity-providers">
          <Link to="/identity-providers">
            <UserOutlined />
            <span className="nav-text">Identity Providers</span>
          </Link>
        </Menu.Item>
        <Menu.Item key="/settings">
          <Link to="/settings">
            <SettingOutlined />
            <span className="nav-text">Settings</span>
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};

export default Sidebar;
