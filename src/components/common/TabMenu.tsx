import React, {forwardRef, ReactNode, useEffect, useImperativeHandle, useState} from "react";
import {theme} from "antd";
import {useLocation, useNavigate} from "react-router-dom";

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
  tabBarExtraContent,
  onRefresh,
}, ref) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = theme.useToken();
  
  // 初始化时直接根据当前路径确定激活的标签页，避免闪动
  const getInitialActiveKey = () => {
    const path = location.pathname;
    const currentTab = items.find((tab) => tab.path === path);
    return currentTab ? currentTab.key : defaultActiveKey;
  };
  
  const [activeKey, setActiveKey] = useState(getInitialActiveKey);
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

  const activeTab = items.find(tab => tab.key === activeKey);
  const ActiveElement = activeTab?.element;

  return (
    <div 
      className={className}
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      {/* 自定义标签栏 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
          padding: '0 8px',
          minHeight: '30px',
          gap: '2px'
        }}
      >
        {/* 标签页按钮 */}
        <div style={{ display: 'flex', gap: '1px', flex: 1 }}>
          {items.map((item) => {
            const isActive = item.key === activeKey;
            return (
              <button
                key={item.key}
                onClick={() => onChange(item.key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: '2px 8px',
                  border: 'none',
                  borderRadius: `${token.borderRadius}px ${token.borderRadius}px 0 0`,
                  background: isActive ? token.colorBgContainer : token.colorFillSecondary,
                  color: isActive ? token.colorPrimary : token.colorTextSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  fontSize: '12px',
                  fontWeight: isActive ? 500 : 400,
                  position: 'relative',
                  borderBottom: isActive ? `2px solid ${token.colorPrimary}` : '2px solid transparent',
                  marginBottom: '-1px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = token.colorFillTertiary;
                    e.currentTarget.style.color = token.colorText;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = token.colorFillSecondary;
                    e.currentTarget.style.color = token.colorTextSecondary;
                  }
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
        
        {/* 右侧操作按钮 */}
        {tabBarExtraContent && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {tabBarExtraContent}
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div
        style={{
          flex: 1,
          overflow: 'hidden',
          background: token.colorBgContainer
        }}
      >
        {ActiveElement && (
          <ActiveElement key={activeKey === activeKey ? `${activeKey}-${refreshKey}` : activeKey} />
        )}
      </div>
    </div>
  );
});

export default TabMenu;
