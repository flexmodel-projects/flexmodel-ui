export type Db = { name: string; icon: any; }; 

export interface DatasourceSchema {
  name: string;
  type: DatasourceType;
  config: any; // 根据具体配置细化，如 { dbKind: string; url?: string; username?: string; password?: string; }
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export type DatasourceType = 'SYSTEM' | 'USER'; 