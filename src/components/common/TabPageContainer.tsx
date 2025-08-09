import React, {useRef} from "react";
import {Button, Layout, theme} from "antd";
import {FullscreenExitOutlined, FullscreenOutlined, ReloadOutlined} from "@ant-design/icons";
import TabMenu, {TabMenuItem, TabMenuRef} from "./TabMenu";
import {useFullscreen} from "../../hooks/useFullscreen";

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
  const { isFullscreen, toggle, ref } = useFullscreen(token.colorBgContainer);
  const tabMenuRef = useRef<TabMenuRef>(null);

  return (
    <Layout
      ref={ref}
      className={`${className || ''} relative transition-all duration-300`}
      style={{
        height: '100%',
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
            ref={tabMenuRef}
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
            tabBarExtraContent={
              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  size="small"
                  icon={<ReloadOutlined />}
                  onClick={() => tabMenuRef.current?.refreshCurrentTab()}
                  title="刷新标签页"
                />
                <Button
                  type="text"
                  size="small"
                  icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                  onClick={toggle}
                  title={isFullscreen ? "退出全屏" : "全屏"}
                />
              </div>
            }
           />
        </Layout.Content>
      </Layout>
  );
};

export default TabPageContainer;
