import React from "react";
import {Layout, theme} from "antd";
import TabMenu, {TabMenuItem} from "./TabMenu";

interface TabPageContainerProps {
  items: TabMenuItem[];
  defaultActiveKey: string;
  className?: string;
  style?: React.CSSProperties;
  type?: "card" | "line";
  size?: "small" | "middle" | "large";
  compact?: boolean;
  showHeader?: boolean;
  headerContent?: React.ReactNode;
}

const TabPageContainer: React.FC<TabPageContainerProps> = ({
  items,
  defaultActiveKey,
  className,
  style,
  type = "card",
  size = "small",
  compact = false,
  showHeader = false,
  headerContent
}) => {
  const { token } = theme.useToken();

  return (
    <Layout
      className={`${className || ''}`}
      style={{
        height: '100% !important',
        background: token.colorBgContainer,
        display: 'flex',
        flexDirection: 'column',
        ...style
      }}
    >
        {showHeader && headerContent && (
          <Layout.Header>
            {headerContent}
          </Layout.Header>
        )}

        <Layout.Content style={{
            background: token.colorBgContainer,
            height: '100%',
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <TabMenu
            items={items}
            defaultActiveKey={defaultActiveKey}
            type={type}
            size={size}
            compact={compact}
            style={{
              background: token.colorBgContainer,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              flex: 1
            }}
          />
        </Layout.Content>
      </Layout>
  );
};

export default TabPageContainer;
