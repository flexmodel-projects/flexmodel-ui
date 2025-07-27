import React from 'react';
import {theme} from 'antd';
import {getCompactCardStyle} from '@/utils/theme';

interface ModelGroupViewProps {
  datasource: string;
  model: any;
}

const ModelGroupView: React.FC<ModelGroupViewProps> = ({model}) => {
  const { token } = theme.useToken();

  // 紧凑主题样式
  const containerStyle = {
    ...getCompactCardStyle(token),
    padding: token.paddingSM,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: ` ${token.colorBorder}`,
    textAlign: 'center' as const,
    color: token.colorTextSecondary,
    fontSize: token.fontSizeSM,
  };

  return (
    <div style={containerStyle}>
      {model?.name || 'Model Group'}
    </div>
  );
};

export default ModelGroupView;
