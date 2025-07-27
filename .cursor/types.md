# 项目类型定义库

## 基础类型定义

### 1. 通用响应类型
```typescript
// 分页结果类型
export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// 基础实体类型
export interface BaseEntity {
  id: string;
  createTime: string;
  updateTime: string;
  createBy?: string;
  updateBy?: string;
}

// 状态枚举
export type StatusType = 'active' | 'inactive' | 'deleted';
export type JobStatusType = 'pending' | 'running' | 'completed' | 'failed';
```

### 2. 数据模型相关类型
```typescript
// 数据表类型
export interface DataTable extends BaseEntity {
  name: string;
  displayName: string;
  description?: string;
  fields: DataField[];
  relationships: DataRelationship[];
  status: StatusType;
}

// 数据字段类型
export interface DataField {
  id: string;
  name: string;
  displayName: string;
  type: FieldType;
  length?: number;
  precision?: number;
  scale?: number;
  isPrimary: boolean;
  isNullable: boolean;
  isUnique: boolean;
  defaultValue?: string;
  description?: string;
}

// 字段类型枚举
export type FieldType = 
  | 'string' 
  | 'number' 
  | 'boolean' 
  | 'date' 
  | 'datetime' 
  | 'text' 
  | 'json' 
  | 'binary';

// 数据关系类型
export interface DataRelationship {
  id: string;
  name: string;
  sourceTable: string;
  targetTable: string;
  sourceField: string;
  targetField: string;
  type: RelationshipType;
  cascadeDelete: boolean;
  cascadeUpdate: boolean;
}

// 关系类型枚举
export type RelationshipType = 'one-to-one' | 'one-to-many' | 'many-to-many';
```

### 3. 任务管理相关类型
```typescript
// 任务类型
export interface Job extends BaseEntity {
  name: string;
  description?: string;
  status: JobStatusType;
  progress: number;
  startTime?: string;
  endTime?: string;
  errorMessage?: string;
  parameters?: Record<string, any>;
  result?: Record<string, any>;
}

// 创建任务请求
export interface CreateJobRequest {
  name: string;
  description?: string;
  parameters?: Record<string, any>;
}

// 更新任务请求
export interface UpdateJobRequest {
  name?: string;
  description?: string;
  parameters?: Record<string, any>;
}
```

### 4. 用户和权限相关类型
```typescript
// 用户类型
export interface User extends BaseEntity {
  username: string;
  email: string;
  displayName: string;
  avatar?: string;
  status: StatusType;
  roles: Role[];
}

// 角色类型
export interface Role extends BaseEntity {
  name: string;
  displayName: string;
  description?: string;
  permissions: Permission[];
}

// 权限类型
export interface Permission extends BaseEntity {
  name: string;
  displayName: string;
  resource: string;
  action: string;
  description?: string;
}
```

### 5. ER图相关类型
```typescript
// ER图节点类型
export interface ERNode {
  id: string;
  type: 'table';
  position: { x: number; y: number };
  data: {
    table: DataTable;
    label: string;
    fields: DataField[];
  };
}

// ER图边类型
export interface EREdge {
  id: string;
  source: string;
  target: string;
  type: 'relationship';
  data: {
    relationship: DataRelationship;
    label: string;
  };
}

// ER图数据
export interface ERDiagramData {
  nodes: ERNode[];
  edges: EREdge[];
}
```

### 6. 表单相关类型
```typescript
// 表单字段配置
export interface FormFieldConfig {
  name: string;
  label: string;
  type: 'input' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'date' | 'number';
  required?: boolean;
  placeholder?: string;
  options?: Array<{ label: string; value: any }>;
  rules?: any[];
  props?: Record<string, any>;
}

// 表单配置
export interface FormConfig {
  fields: FormFieldConfig[];
  layout?: 'horizontal' | 'vertical' | 'inline';
  labelCol?: { span: number };
  wrapperCol?: { span: number };
}
```

### 7. 表格相关类型
```typescript
// 表格列配置
export interface TableColumnConfig<T = any> {
  title: string;
  dataIndex: keyof T;
  key: string;
  width?: number;
  fixed?: 'left' | 'right';
  sorter?: boolean | ((a: T, b: T) => number);
  render?: (value: any, record: T, index: number) => React.ReactNode;
  filters?: Array<{ text: string; value: any }>;
  onFilter?: (value: any, record: T) => boolean;
}

// 表格配置
export interface TableConfig<T = any> {
  columns: TableColumnConfig<T>[];
  rowKey: keyof T | ((record: T) => string);
  pagination?: {
    current?: number;
    pageSize?: number;
    total?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => string;
  };
  loading?: boolean;
  scroll?: { x?: number | true; y?: number };
}
```

### 8. API相关类型
```typescript
// API请求配置
export interface ApiRequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params?: Record<string, any>;
  data?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  code?: number;
}

// 错误类型
export interface ApiError {
  code: number;
  message: string;
  details?: any;
}
```

### 9. 主题相关类型
```typescript
// 主题配置
export interface ThemeConfig {
  primaryColor: string;
  borderRadius: number;
  compact: boolean;
  darkMode: boolean;
}

// 样式Token类型
export interface StyleToken {
  colorPrimary: string;
  borderRadius: number;
  fontSize: number;
  padding: number;
  margin: number;
  controlHeight: number;
}
```

### 10. 工具函数类型
```typescript
// 数据加载Hook返回类型
export interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

// 分页Hook参数类型
export interface UsePaginationOptions {
  page: number;
  pageSize: number;
  total?: number;
}

// 分页Hook返回类型
export interface UsePaginationReturn {
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  setPagination: (pagination: Partial<UsePaginationOptions>) => void;
}
``` 