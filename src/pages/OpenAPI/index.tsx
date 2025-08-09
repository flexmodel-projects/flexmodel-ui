import React from 'react';
import {theme} from 'antd';
import {useTheme} from '@/store/appStore';

const OpenAPI: React.FC = () => {
  const { token } = theme.useToken();
  const { isDark } = useTheme();

  // 计算内容区域的高度：100vh - 头部高度 - padding
  const contentHeight = `calc(100vh - ${token.controlHeight * 1.5}px - ${token.padding * 2}px)`;

  return (
    <div style={{
      width: '100%',
      height: contentHeight,
      border: 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <iframe
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          flex: 1
        }}
        src={`${import.meta.env.BASE_URL}/rapi-doc/index.html?theme=${isDark ? 'dark' : 'light'}`}
        title="Rapi Doc"
      />
    </div>
  );
};

export default OpenAPI;
