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
- **UI组件**: 优先使用官方 Ant Design 组件，避免自定义包装器如 Sidebar
- **API设计**: API 定义直接返回业务数据类型（如 Promise<Job[]>），使用 api.get/post/put/delete 方法，不暴露 BaseResponse 包装器
- **类型安全**: 复杂返回结构使用 PagedResult<T> 类型和具体参数类型，避免 any

### 2. 组件样式优化规则


### 3. Ant Design v5 紧凑主题配置

#### 全局主题配置
- 在 `src/App.tsx` 中配置完整的紧凑主题 Token 和组件参数
- 支持响应式设计和夜间模式


### 4. 代码规范

#### 组件开发模板
```tsx
// 正确的组件写法 - 使用官方组件
import React from 'react';
import { Card, Space, Typography } from 'antd';

const MyComponent: React.FC = () => {
  return (
    <Card>
      <Space direction="vertical">
        <Typography.Title level={5} style={{ margin: 0 }}>
          标题
        </Typography.Title>
        {/* 组件内容 */}
      </Space>
    </Card>
  );
};

export default MyComponent;
```

#### 避免的写法
```tsx
// 避免的写法 - 自定义样式
const containerStyle = {
  padding: token.paddingSM,
  backgroundColor: token.colorBgContainer,
  borderRadius: token.borderRadius,
  border: `1px solid ${token.colorBorder}`,
};

return (
  <div style={containerStyle}>
    {/* 内容 */}
  </div>
);
```

***注意: 尽量避免自定义CSS, 如有必要, 请使用Tailwind CSS!***

### 5. 布局组件规范

#### PageLayout.tsx
- 使用官方组件进行布局
- 内容区域使用 Card 组件包装
- 避免自定义样式定义

#### Header.tsx
- 使用 Typography 组件显示标题
- 使用 Space 组件控制按钮间距
- 避免自定义样式

#### Sidebar.tsx
- 使用官方菜单组件
- 避免自定义包装器

### 6. 工具函数使用

**优先使用官方组件**，减少对工具函数的依赖：
- 使用 `Card` 组件替代自定义容器
- 使用 `Space` 组件替代自定义间距
- 使用 `Typography` 组件替代自定义文本样式

### 7. 最佳实践

1. **优先使用官方组件**: 在组件中优先使用 Ant Design 官方组件
2. **减少自定义样式**: 避免定义自定义样式对象
3. **移除小尺寸设置**: 统一使用默认尺寸
4. **保持一致性**: 确保所有组件都遵循相同的设计规范
5. **简化代码**: 保持代码简洁和可读性
5. **最少原则**: 请尽量少改动

### 8. 代码风格要求

- 使用 TypeScript 严格模式
- 组件使用函数式组件和 React Hooks
- 使用 ES6+ 语法
- 保持代码简洁和可读性
- 添加适当的类型注解
- 使用中文注释和变量名
- **始终使用中文回复**

### 9. 文件组织规范

- 组件放在 `src/components/` 目录
- 页面放在 `src/pages/` 目录
- 工具函数放在 `src/utils/` 目录
- 类型定义放在 `src/types/` 目录
- API 服务放在 `src/services/` 目录

### 10. 组件重构检查清单

当重构组件时，请检查以下项目：

- [ ] 使用 `Card` 组件替代自定义容器
- [ ] 使用 `Space` 组件优化布局
- [ ] 使用 `Typography` 组件替代自定义标题


## AI 助手指令

当AI助手帮助您开发时，请遵循以下指令：

1. **始终使用中文回复**
2. **尽量使用官方 Ant Design 布局组件，避免自定义包装器**
3. **严格遵循组件样式优化规则**
4. **优先使用官方组件和样式，减少自定义样式**
5. **提供完整的 TypeScript 类型定义**
6. **注意: 请避免自定义CSS，没有要求一定不要新增css文件，如有必要, 请使用Tailwind CSS!**
7. **组件都需要支持夜间模式，尽量少改动代码**
