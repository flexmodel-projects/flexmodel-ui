# FlexModel UI React 项目上下文

## 项目背景
FlexModel UI React 是一个基于 React + TypeScript + Ant Design v5 的企业级数据建模和可视化平台。项目采用紧凑主题设计，提供直观的数据模型编辑和ER图可视化功能。

## 技术架构

### 前端技术栈
- **框架**: React 18+ (函数式组件 + Hooks)
- **语言**: TypeScript (严格模式)
- **UI库**: Ant Design v5 (紧凑主题)
- **构建工具**: Vite
- **样式**: Tailwind CSS + Ant Design Token系统
- **状态管理**: Redux Toolkit
- **图表库**: antv/x6
- **路由**: React Router v6

### 项目结构
```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── services/      # API服务
├── utils/         # 工具函数
├── types/         # TypeScript类型定义
├── hooks/         # 自定义Hooks
├── store/         # Redux状态管理
└── assets/        # 静态资源
```

## 核心功能模块

### 1. 数据模型管理
- 数据表创建和编辑
- 字段类型定义
- 关系映射配置
- 模型版本控制

### 2. ER图可视化
- 使用 antv/x6 渲染交互式ER图
- 拖拽式节点编辑
- 关系线可视化
- 实时布局调整

### 3. 紧凑主题系统
- 基于 Ant Design v5 Token 系统
- 统一的间距、圆角、字体规范
- 响应式设计支持
- 夜间模式适配

## 开发规范

### 组件开发原则
1. **函数式组件**: 优先使用函数式组件和React Hooks
2. **TypeScript**: 严格类型检查，避免any类型
3. **Token系统**: 使用theme.useToken()获取设计token
4. **工具函数**: 优先使用utils/theme.ts中的样式工具函数
5. **中文注释**: 代码注释和变量名使用中文

### API设计规范
- 直接返回业务数据类型 (Promise<Job[]>)
- 使用api.get/post/put/delete方法
- 复杂结构使用PagedResult<T>类型
- 避免BaseResponse包装器暴露

### 样式规范
- 基础间距: 4px
- 控件高度: 24px/28px/32px
- 字体大小: 12px基础，10px-16px变体
- 圆角: 1px-8px统一规范

## 关键依赖版本
- React: ^18.0.0
- TypeScript: ^5.0.0
- Ant Design: ^5.0.0
- antv/x6: ^11.0.0
- Vite: ^4.0.0
- Tailwind CSS: ^3.0.0

## 开发环境
- Node.js: 18+
- 包管理器: npm/yarn
- 编辑器: VS Code + Cursor
- 浏览器: Chrome/Firefox/Safari

## 部署环境
- 构建工具: Vite
- 静态托管: Nginx
- CDN: 阿里云CDN
- 域名: flexmodel.example.com 