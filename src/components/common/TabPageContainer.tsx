import React, {useRef} from "react";
import {Button, theme} from "antd";
import {FullscreenExitOutlined, FullscreenOutlined, ReloadOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import TabMenu, {TabMenuItem, TabMenuRef} from "./TabMenu";
import {useFullscreen} from "@/hooks/useFullscreen.ts";

interface TabPageContainerProps {
  items: TabMenuItem[];
  defaultActiveKey: string;
  style?: React.CSSProperties;
}

const TabPageContainer: React.FC<TabPageContainerProps> = ({
                                                             items,
                                                             defaultActiveKey,
                                                           }) => {
  const {t} = useTranslation();
  const {token} = theme.useToken();
  const {isFullscreen, toggle, ref} = useFullscreen(token.colorBgContainer);
  const tabMenuRef = useRef<TabMenuRef>(null);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{
        height: 'calc(100vh - 64px)',
        width: '100%',
        background: token.colorBgContainer,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <TabMenu
        ref={tabMenuRef}
        items={items}
        defaultActiveKey={defaultActiveKey}
        size="small"
        style={{
          background: token.colorBgContainer,
          display: 'flex',
          flexDirection: 'column',
          flex: 1
        }}
        tabBarExtraContent={
          <div className="flex items-center gap-1">
            <Button
              type="text"
              size="small"
              icon={<ReloadOutlined/>}
              onClick={() => tabMenuRef.current?.refreshCurrentTab()}
              title={t('refresh_tab')}
            />
            <Button
              type="text"
              size="small"
              icon={isFullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
              onClick={toggle}
              title={isFullscreen ? t('exit_fullscreen') : t('fullscreen')}
            />
          </div>
        }
      />
    </div>
  );
};
export default TabPageContainer;
