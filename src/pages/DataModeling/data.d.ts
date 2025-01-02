export interface Datasource {
  name: string;
  type: string;
  createTime: string;
  config: {
    dbKind: string,
    url?: string;
    username?: string;
    password?: string;
  }
}

export interface Model {
  name: string,
  comment: string,
  fields: any[],
  indexes: any[]
}

interface Field extends Record<string, object> {
  name: string;
  type: string;
  unique: boolean;
  nullable: boolean;
  comment: string;
}


export interface Index {
  name: string;
  fields: { fieldName: string; direction: 'ASC' | 'DESC' }[];
  unique: boolean;
}


export type Endpoint = { name: string; type: string; icon: any; enable: boolean }


export type FieldType = { name: string; label: string; }


export interface IdentifyProvider {
  name: string,
  provider: {
    type: string,
    clientId?: string,
    clientSecret?: string,
  },
  createdAt?: string,
  updatedAt?: string,
}
