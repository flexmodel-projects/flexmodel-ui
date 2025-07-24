export type IdP = { name: string; icon: any }; 

export interface Datasource {
  name: string;
  type: string;
  createTime: string;
  config: {
    dbKind: string;
    url?: string;
    username?: string;
    password?: string;
  };
}

export interface Model extends TypeWrapper {
  fields: any[];
}

export interface TypeWrapper {
  name: string;
  type: "ENTITY" | "NATIVE_QUERY" | "ENUM";
}

export interface Entity extends Model {
  indexes: any[];
  comment?: string;
}

export interface Enum extends TypeWrapper {
  elements: string[];
  comment?: string;
}

export interface NativeQueryModel extends TypeWrapper {
  statement: string;
}

export interface Field extends Record<string, any> {
  name: string;
  type: string;
  concreteType: string;
  unique: boolean;
  nullable: boolean;
  comment?: string;
  multiple?: boolean;
  defaultValue?: any;
  from?: string;
  tmpType?: string;
}

export interface Index {
  name: string;
  fields: { fieldName: string; direction: "ASC" | "DESC" }[];
  unique: boolean;
}

export type Endpoint = {
  name: string;
  type: string;
  icon: any;
  enable: boolean;
};

export type FieldType = { name: string; label: string };

export interface IdentifyProvider {
  name: string;
  provider: {
    type: string;
    clientId?: string;
    clientSecret?: string;
  };
  createdAt?: string;
  updatedAt?: string;
} 

export interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  comment?: string;
  generatedValue?: 'AUTO_INCREMENT' | 'BIGINT_NOT_GENERATED' | 'STRING_NOT_GENERATED';
}

export interface MRecord {
  [key: string]: any;
}

export interface RecordListProps {
  datasource: string;
  model: any; // Entity类型建议在实际使用时import
} 