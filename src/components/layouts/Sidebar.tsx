import React, {useEffect, useState} from 'react';
import {Layout, Menu} from 'antd';
import {Link, useLocation} from 'react-router-dom';
import {
  ApiOutlined,
  DatabaseOutlined,
  DeploymentUnitOutlined,
  FileTextOutlined,
  LineChartOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

// 定义菜单项的类型
interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: React.ReactNode;
  children?: MenuItem[];
}

// 菜单数据
const menuData: MenuItem[] = [
  {
    key: "api",
    icon: <ApiOutlined/>,
    label: "API",
    children: [
      {
        key: "/api-management",
        icon: <DeploymentUnitOutlined/>,
        label: <Link to="/api-management">API Management</Link>,
      },
      {
        key: "/api-document",
        icon: <FileTextOutlined/>,
        label: <Link to="/api-document">API Document</Link>,
      },
      {
        key: "/api-log",
        icon: <LineChartOutlined/>,
        label: <Link to="/api-log">API Log</Link>,
      },
    ],
  },
  {
    key: "data",
    icon: <DatabaseOutlined/>,
    label: "Data",
    children: [
      {
        key: "/datasource",
        icon: <FileTextOutlined/>,
        label: <Link to="/datasource">Data source</Link>,
      },
      {
        key: "/modeling",
        icon: <FileTextOutlined/>,
        label: <Link to="/modeling">Data modeling</Link>,
      },
    ],
  },
  {
    key: "/identity-providers",
    icon: <UserOutlined/>,
    label: <Link to="/identity-providers">Identity Providers</Link>,
  },
  {
    key: "/settings",
    icon: <SettingOutlined/>,
    label: <Link to="/settings">Settings</Link>,
  },
];

const Sidebar: React.FC<{ defaultSelectedKey?: string }> = ({defaultSelectedKey = "1"}) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const location = useLocation();

  // 获取当前路径
  const currentPath = location.pathname;

  // 根据当前路径计算需要展开的菜单项
  const getOpenKeys = (menuItems: MenuItem[]): string[] => {
    const keys: string[] = [];
    menuItems.forEach(item => {
      if (item.children) {
        item.children.forEach(child => {
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
    console.log('handle menu click: ', key);
    setOpenKeys(getOpenKeys(menuData)); // 获取当前选中路径的父菜单并展开
  };

  return (
    <Layout.Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
      <div className="logo">
        <img src="/logo.svg" width={40} alt="logo"/>
        {!collapsed && <span style={{fontSize: 20, color: '#fff', marginLeft: 10}}>Flexmodel</span>}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[defaultSelectedKey]}
        openKeys={openKeys}
        onOpenChange={setOpenKeys} // 处理手动展开/关闭
        items={menuData.map(item => ({
          key: item.key,
          icon: item.icon,
          label: item.label,
          children: item.children?.map(child => ({
            key: child.key,
            icon: child.icon,
            label: child.label,
          })),
        }))}
        onClick={({key}) => handleMenuClick(key)} // 处理菜单项点击
      />
    </Layout.Sider>
  );
};

export default Sidebar;
