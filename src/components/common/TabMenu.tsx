import React, {ReactNode, useEffect, useState} from "react";
import {Tabs} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import styles from "./TabMenu.module.scss";

export interface TabMenuItem {
  key: string;
  label: string;
  element: React.ComponentType<any>;
  icon: ReactNode;
  path: string;
}

interface TabMenuProps {
  items: TabMenuItem[];
  defaultActiveKey: string;
  className?: string;
  style?: React.CSSProperties;
  type?: "card" | "line";
  size?: "small" | "middle" | "large";
  compact?: boolean;
}

const TabMenu: React.FC<TabMenuProps> = ({
  items,
  defaultActiveKey,
  className,
  style,
  type = "card",
  size = "small",
  compact = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(defaultActiveKey);

  // 根据当前路径设置激活的标签页
  useEffect(() => {
    const path = location.pathname;
    const currentTab = items.find(tab => tab.path === path);
    if (currentTab) {
      setActiveKey(currentTab.key);
    } else {
      // 如果当前路径不匹配任何标签页，重定向到默认标签页
      const defaultTab = items.find(tab => tab.key === defaultActiveKey);
      if (defaultTab && path !== defaultTab.path) {
        navigate(defaultTab.path, { replace: true });
      }
    }
  }, [location.pathname, navigate, items, defaultActiveKey]);

  // 标签页切换处理
  const onChange = (key: string) => {
    const targetTab = items.find(tab => tab.key === key);
    if (targetTab) {
      setActiveKey(key);
      navigate(targetTab.path);
    }
  };

  return (
    <Tabs
      className={`${styles.compactTabs} ${compact ? styles.compact : ''} ${className || ''}`}
      style={style}
      activeKey={activeKey}
      onChange={onChange}
      type={type}
      size={size}
      tabBarGutter={4}
      destroyInactiveTabPane={true}
      items={items.map((content) => {
        const { label, key, icon, element: Element } = content;

        return {
          label,
          key,
          children: <Element />,
          icon,
        };
      })}
    />
  );
};

export default TabMenu;
