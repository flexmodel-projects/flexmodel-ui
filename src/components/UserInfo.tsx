import React, {useCallback, useMemo, useState} from "react";
import {Avatar, Dropdown, theme as antdTheme, Typography} from "antd";
import {LogoutOutlined, QuestionCircleOutlined, UserOutlined} from "@ant-design/icons";
import {useAuth} from "@/store/authStore";
import {useTranslation} from "react-i18next";

interface UserInfoProps {
  isCollapsed: boolean;
  onHelpClick?: () => void;
}

const UserInfo: React.FC<UserInfoProps> = ({
                                             isCollapsed,
                                             onHelpClick,
                                           }) => {
  const {t} = useTranslation();
  const {user, logout} = useAuth();

  // 使用认证store中的用户信息，如果没有则使用默认值
  const userName = user?.username || "超级管理员";
  const {token} = antdTheme.useToken();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const userInfoStyle = useMemo(() => ({
    padding: token.padding,
    backgroundColor: token.colorBgContainer,
    borderRadius: '0 0 0 8px',
    marginTop: 'auto',
    position: 'relative' as const,
    minHeight: '60px',
  }), [token.padding, token.colorBgContainer]);

  const userInfoContentStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: token.marginSM,
    opacity: isCollapsed ? 0 : 1,
    transform: isCollapsed ? 'translateX(-10px)' : 'translateX(0)',
    transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1), all 0.2s ease',
    pointerEvents: isCollapsed ? 'none' as const : 'auto' as const,
    height: '40px',
    width: '100%',
    cursor: 'pointer',
    padding: `0 ${token.padding}px`,
    borderRadius: token.borderRadius,
  }), [isCollapsed, token.marginSM, token.padding, token.borderRadius]);

  const collapsedUserIconStyle = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: token.paddingSM,
    cursor: 'pointer',
    opacity: isCollapsed ? 1 : 0,
    transform: isCollapsed ? 'translateX(0)' : 'translateX(-10px)',
    transition: 'opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)',
    pointerEvents: isCollapsed ? 'auto' as const : 'none' as const,
    height: '40px',
    width: '100%',
    position: 'absolute' as const,
    top: token.padding,
    left: 0,
  }), [isCollapsed, token.paddingSM, token.padding]);

  const userNameStyle = useMemo(() => ({
    flex: 1,
    fontSize: token.fontSize,
    color: token.colorText,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  }), [token.fontSize, token.colorText]);

  // 用户下拉菜单项
  const userMenuItems = useMemo(() => [
    {
      key: 'user-info',
      label: (
        <div style={{padding: '8px 0', borderBottom: `1px solid ${token.colorBorderSecondary}`}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <UserOutlined style={{color: token.colorTextSecondary}}/>
            <span style={{fontSize: token.fontSize, color: token.colorText}}>
              {userName}
            </span>
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      key: 'help',
      icon: <QuestionCircleOutlined/>,
      label: t('help'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined/>,
      label: t('logout'),
      danger: true,
    },
  ], [token.colorBorderSecondary, token.colorTextSecondary, token.fontSize, token.colorText, userName, t]);

  // 处理用户菜单点击
  const handleUserMenuClick = useCallback(({key}: { key: string }) => {
    switch (key) {
      case 'help':
        onHelpClick?.();
        break;
      case 'logout':
        logout();
        break;
    }
    setUserDropdownOpen(false);
  }, [onHelpClick, logout]);

  // 渲染用户信息内容
  const renderUserContent = useCallback(() => {
    if (isCollapsed) {
      return (
        <div
          style={collapsedUserIconStyle}
          onMouseEnter={(e) => {
            const avatar = e.currentTarget.querySelector('.ant-avatar') as HTMLElement;
            if (avatar) {
              avatar.style.transform = 'scale(1.05)';
            }
            e.currentTarget.style.backgroundColor = token.colorBgTextHover;
          }}
          onMouseLeave={(e) => {
            const avatar = e.currentTarget.querySelector('.ant-avatar') as HTMLElement;
            if (avatar) {
              avatar.style.transform = 'scale(1)';
            }
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <Avatar
            size={25}
            icon={<UserOutlined/>}
            style={{
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>
      );
    }

    return (
      <div
        style={userInfoContentStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = token.colorBgTextHover;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <Avatar
          size={25}
          icon={<UserOutlined/>}
          style={{flexShrink: 0, cursor: 'pointer'}}
        />
        <Typography.Text style={userNameStyle}>
          {userName}
        </Typography.Text>
      </div>
    );
  }, [isCollapsed, collapsedUserIconStyle, userInfoContentStyle, userNameStyle, token.colorBgTextHover, userName]);

  return (
    <div style={userInfoStyle}>
      <Dropdown
        menu={{
          items: userMenuItems,
          onClick: handleUserMenuClick,
        }}
        open={userDropdownOpen}
        onOpenChange={setUserDropdownOpen}
        placement="top"
        trigger={['click']}
        overlayStyle={{
          minWidth: '150px',
        }}
      >
        {renderUserContent()}
      </Dropdown>
    </div>
  );
};

export default UserInfo;
