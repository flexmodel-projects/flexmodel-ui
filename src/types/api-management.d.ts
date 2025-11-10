export interface Execution {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
  headers?: Record<string, any>;
}

export interface GraphQLData {
  operationName?: string;
  query: string;
  variables?: Record<string, any> | null;
  headers?: Record<string, any> | null;
}

export interface ApiMeta {
  // 接口鉴权
  auth?: boolean;
  // 身份源
  identityProvider?: string;
  // 是否启用限流
  rateLimitingEnabled?: boolean;
  // 最大请求数
  maxRequestCount?: number;
  // 间隔时间
  intervalInSeconds?: number;
  execution?: Execution;
}

export interface ApiDefinition {
  id: string;
  name: string;
  parentId?: string | null;
  type?: string;
  method?: string;
  path?: string;
  children?: ApiDefinition[];
  settingVisible?: boolean;
  data: any;
  meta: ApiMeta;
  enabled: boolean;
  graphql?: GraphQLData;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  settingVisible?: boolean;
  data: ApiDefinition;
}

export interface ApiDefinitionSchema {
  id: string;
  type: ApiType;
  path: string;
  meta: ApiMeta;
  name: string;
  createdAt: string; // 使用ISO日期字符串
  updatedAt: string;
  parentId: string;
  enabled: boolean;
  method: string;
}

export interface ApiDefinitionTreeDTO {
  id: string;
  name: string;
  parentId: string;
  type: ApiType;
  method: string;
  path: string;
  createdAt: string;
  updatedAt: string;
  meta: ApiMeta;
  enabled: boolean;
  children: ApiDefinitionTreeDTO[];
}

export interface ApiDefinitionTreeSchema extends ApiDefinitionSchema {
  children: ApiDefinitionTreeDTO[];
}

export interface GenerateAPIsDTO {
  datasourceName: string;
  modelName: string;
  apiFolder: string;
  idFieldOfPath: string;
  generateAPIs: string[];
}

export type ApiType = 'FOLDER' | 'API';

// GraphQL 响应类型定义
export interface GraphQLResponse<T = any> {
  errors: any[];
  data: T;
  extensions: any | null;
  dataPresent: boolean;
}

export interface GraphQLIntrospectionResponse extends GraphQLResponse<{
  __schema: any;
}> {
}

// GraphQL 查询参数类型
export interface GraphQLQueryParams {
  query: string;
  variables?: Record<string, any>;
  operationName?: string;
}
