import {theme} from 'antd';

// 获取当前主题的 token
export const useThemeToken = () => {
  const { token } = theme.useToken();
  return token;
};

// 紧凑主题的间距配置
export const compactSpacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

// 紧凑主题的圆角配置
export const compactBorderRadius = {
  xs: 1,
  sm: 2,
  md: 4,
  lg: 6,
  xl: 8,
};

// 紧凑主题的字体大小配置
export const compactFontSize = {
  xs: 10,
  sm: 11,
  md: 12,
  lg: 14,
  xl: 16,
  xxl: 18,
};

// 紧凑主题的控制高度配置
export const compactControlHeight = {
  sm: 24,
  md: 28,
  lg: 32,
};

// 页面容器的紧凑样式
export const getCompactPageStyle = (token: any) => ({
  padding: token.padding,
  gap: token.marginSM,
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
});

// 卡片容器的紧凑样式
export const getCompactCardStyle = (token: any) => ({
  borderRadius: token.borderRadius,
  height: '100%',
  display: 'flex',
  flexDirection: 'column' as const,
});

// 表单容器的紧凑样式
export const getCompactFormStyle = (token: any) => ({
  padding: token.padding,
  gap: token.marginSM,
});

// 表格容器的紧凑样式
export const getCompactTableStyle = (token: any) => ({
  borderRadius: token.borderRadius,
  overflow: 'hidden',
});

// 按钮组的紧凑样式
export const getCompactButtonGroupStyle = (token: any) => ({
  gap: token.marginSM,
  marginBottom: token.marginMD,
});

// 分割面板的紧凑样式
export const getCompactSplitterStyle = (token: any) => ({
  gap: token.marginXS,
  height: '100%',
});

// 面板容器的紧凑样式
export const getCompactPanelStyle = (token: any) => ({
  padding: token.paddingSM,
  borderRadius: token.borderRadius,
  height: '100%',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column' as const,
});

// 响应式紧凑样式
export const getResponsiveCompactStyle = (token: any, isMobile: boolean = false) => {
  if (isMobile) {
    return {
      padding: token.paddingSM,
      gap: token.marginXS,
      fontSize: token.fontSizeSM,
    };
  }
  return {
    padding: token.padding,
    gap: token.marginSM,
    fontSize: token.fontSize,
  };
};
