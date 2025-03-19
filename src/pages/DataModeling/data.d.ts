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
  type: ObjectType.ENTITY | ObjectType.NATIVE_QUERY | ObjectType.ENUM;
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

interface Field extends Record<string, any> {
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
