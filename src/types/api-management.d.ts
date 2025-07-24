export interface ApiInfo {
  id: string;
  name: string;
  type?: string;
  method?: string;
  children?: ApiInfo[];
  settingVisible?: boolean;
  data: any;
  meta: any;
  enabled: boolean;
}

export interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  settingVisible?: boolean;
  data: ApiInfo;
}

export interface ApiDefinitionSchema {
  id: string;
  type: ApiType;
  path: string;
  meta: any; // 根据需要细化
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
  meta: any;
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