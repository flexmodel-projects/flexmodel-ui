# Cursor Rules - FlexModel UI React 项目

## 项目概述
这是一个基于 React + TypeScript + Ant Design v5 的 FlexModel UI 项目，使用紧凑主题设计。

## 技术栈
- React 18+
- TypeScript
- Ant Design v5 (紧凑主题)
- Vite
- Tailwind CSS
- Redux Toolkit

## 核心开发规则

### 1. 技术选择偏好
- **图表库**: 使用 antv/x6渲染交互式 ER 图
- **UI组件**: 优先使用官方 Ant Design 组件，避免自定义包装器如 Sidebar
- **API设计**: API 定义直接返回业务数据类型（如 Promise<Job[]>），使用 api.get/post/put/delete 方法，不暴露 BaseResponse 包装器
- **类型安全**: 复杂返回结构使用 PagedResult<T> 类型和具体参数类型，避免 any

### 2. Ant Design v5 紧凑主题配置

#### 全局主题配置
- 使用 Ant Design v5 的紧凑主题，提供更紧凑的界面布局
- 在 `src/App.tsx` 中配置完整的紧凑主题 Token 和组件参数
- 支持响应式设计和夜间模式

#### 间距规范
- 基础间距单位：4px
- 间距变体：xs(4px), sm(8px), md(12px), lg(16px), xl(20px)
- **重要**: 优先使用 `theme.useToken()` 获取 token，避免硬编码数值

#### 圆角规范
- 统一圆角规范：xs(1px), sm(2px), md(4px), lg(6px), xl(8px)
- 保持视觉一致性

#### 字体大小
- 基础字体：12px
- 字体变体：xs(10px), sm(11px), md(12px), lg(14px), xl(16px)

#### 控件高度
- 小尺寸：24px
- 中尺寸：28px
- 大尺寸：32px

### 3. 代码规范

#### 组件开发模板
```tsx
// 正确的组件写法
import React from 'react';
import { Card, theme } from 'antd';
import { getCompactPageStyle, getCompactCardStyle } from '@/utils/theme';

const MyPage: React.FC = () => {
  const { token } = theme.useToken();
  
  return (
    <div style={getCompactPageStyle(token)}>
      <Card style={getCompactCardStyle(token)}>
        {/* 页面内容 */}
      </Card>
    </div>
  );
};

export default MyPage;
```

#### Token 系统使用
```tsx
// 优先使用 token 而不是硬编码
const { token } = theme.useToken();

return (
  <Space size={token.marginSM}>
    <Button 
      style={{ 
        height: token.controlHeight,
        borderRadius: token.borderRadius,
        fontSize: token.fontSize
      }}
    >
      按钮
    </Button>
  </Space>
);
```

### 4. 布局组件规范

#### PageLayout.tsx
- 使用 `theme.useToken()` 获取主题 token
- 内容区域使用 `token.padding` 和 `token.marginSM` 进行间距控制
- 高度计算使用 `token.controlHeight` 进行适配

#### Header.tsx
- Header 高度使用 `token.controlHeight * 1.5`
- 面包屑和按钮间距使用 token 系统
- 字体大小使用 `token.fontSizeSM` 和 `token.fontSizeLG`

#### Sidebar.tsx
- Logo 容器高度使用 `token.controlHeight * 1.5`
- 菜单项间距和圆角使用 token 系统
- 折叠按钮使用 `token.fontSizeLG`

### 5. 工具函数使用

**必须优先使用** `src/utils/theme.ts` 中的工具函数：
- `useThemeToken()`: 获取当前主题 token
- `getCompactPageStyle()`: 页面容器紧凑样式
- `getCompactCardStyle()`: 卡片容器紧凑样式
- `getCompactFormStyle()`: 表单容器紧凑样式
- `getCompactTableStyle()`: 表格容器紧凑样式
- `getCompactButtonGroupStyle()`: 按钮组紧凑样式
- `getCompactSplitterStyle()`: 分割面板紧凑样式
- `getCompactPanelStyle()`: 面板容器紧凑样式
- `getResponsiveCompactStyle()`: 响应式紧凑样式

### 6. 最佳实践

1. **优先使用 token**: 在组件中优先使用 `theme.useToken()` 获取 token
2. **使用工具函数**: 对于常见的布局模式，使用 `utils/theme.ts` 中的工具函数
3. **保持一致性**: 确保所有组件都遵循紧凑主题的规范
4. **响应式考虑**: 在移动端测试紧凑主题的效果
5. **可访问性**: 确保紧凑布局下的可访问性不受影响

### 7. 代码风格要求

- 使用 TypeScript 严格模式
- 组件使用函数式组件和 React Hooks
- 使用 ES6+ 语法
- 保持代码简洁和可读性
- 添加适当的类型注解
- 使用中文注释和变量名

### 8. 文件组织规范

- 组件放在 `src/components/` 目录
- 页面放在 `src/pages/` 目录
- 工具函数放在 `src/utils/` 目录
- 类型定义放在 `src/types/` 目录
- API 服务放在 `src/services/` 目录

### 9. 自定义配置位置

如需调整紧凑主题配置，修改以下文件：
1. `src/App.tsx` - token 和 components 配置
2. `src/index.css` - CSS 变量
3. `src/utils/theme.ts` - 工具函数

## AI 助手指令

当AI助手帮助您开发时，请遵循以下指令：

1. **始终使用中文回复**
2. **优先使用 xyflow/react 进行图表渲染**
3. **使用官方 Ant Design 组件，避免自定义包装器**
4. **API 设计直接返回业务数据类型**
5. **严格遵循紧凑主题规范**
6. **优先使用 token 系统和工具函数**
7. **提供完整的 TypeScript 类型定义** 