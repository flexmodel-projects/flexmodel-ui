import React, {forwardRef, ReactNode, useEffect, useImperativeHandle, useState} from "react";
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
  tabBarExtraContent?: ReactNode;
  onRefresh?: () => void;
}

export interface TabMenuRef {
  refreshCurrentTab: () => void;
}

const TabMenu = forwardRef<TabMenuRef, TabMenuProps>(({
  items,
  defaultActiveKey,
  className,
  style,
  type = "card",
  size = "small",
  tabBarExtraContent,
  onRefresh,
}, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState(defaultActiveKey);
  const [refreshKey, setRefreshKey] = useState(0);

  // 根据当前路径设置激活的标签页
  useEffect(() => {
    const path = location.pathname;
    const currentTab = items.find((tab) => tab.path === path);
    if (currentTab) {
      setActiveKey(currentTab.key);
    } else {
      // 如果当前路径不匹配任何标签页，重定向到默认标签页
      const defaultTab = items.find((tab) => tab.key === defaultActiveKey);
      if (defaultTab && path !== defaultTab.path) {
        navigate(defaultTab.path, { replace: true });
      }
    }
  }, [location.pathname, navigate, items, defaultActiveKey]);

  // 标签页切换处理
  const onChange = (key: string) => {
    const targetTab = items.find((tab) => tab.key === key);
    if (targetTab) {
      setActiveKey(key);
      navigate(targetTab.path);
    }
  };

  // 刷新当前标签页
  const refreshCurrentTab = () => {
    setRefreshKey(prev => prev + 1);
    if (onRefresh) {
      onRefresh();
    }
  };

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    refreshCurrentTab,
  }));

  return (
    <Tabs
      className={`${styles.compactTabs} ${
        className || ""
      } `}
      style={style}
      activeKey={activeKey}
      onChange={onChange}
      type={type}
      size={size}
      tabBarGutter={4}
      popupClassName="h-full"
      destroyInactiveTabPane={true}
      tabBarExtraContent={tabBarExtraContent}
      items={items.map((content) => {
        const { label, key, icon, element: Element } = content;

        return {
          label,
          key,
          className: "h-full",
          children: <Element key={key === activeKey ? `${key}-${refreshKey}` : key} className="h-full" />,
          icon,
        };
      })}
    />
  );
});

export default TabMenu;
