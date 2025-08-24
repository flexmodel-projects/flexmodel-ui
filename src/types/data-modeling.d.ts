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
  defaultValue?: DefaultValue;
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

export interface MRecord {
  [key: string]: any;
}

export interface RecordListProps {
  datasource: string;
  model: any; // Entity类型建议在实际使用时import
}

export interface EntitySchema {
  name: string;
  type: string;
  fields: TypedFieldSchema[];
  indexes: IndexSchema[];
  comment?: string;
  additionalProperties?: Record<string, any>;
  idl?: string;
}

export interface EnumSchema {
  name: string;
  comment?: string;
  elements: string[];
  additionalProperties?: Record<string, any>;
  idl?: string;
  type: string;
}

export interface NativeQuerySchema {
  name: string;
  type: string;
  statement: string;
  comment?: string;
  additionalProperties?: Record<string, any>;
  idl?: string;
  parameters?: string[];
  fields?: QueryField[];
}

export interface TypedFieldSchema {
  name: string;
  type: string;
  comment?: string;
  unique: boolean;
  nullable: boolean;
  defaultValue?: DefaultValue;
  additionalProperties?: Record<string, any>;
  modelName: string;
  identity?: boolean;
  concreteType?: string;
}

export interface IndexSchema {
  name: string;
  fields: Field[];
  unique: boolean;
  modelName: string;
}

export interface Field {
  fieldName: string;
  direction: Direction;
}

export type Direction = "ASC" | "DESC";

export interface QueryField {
  name: string;
  aliasName?: string;
  fieldName?: string;
}

export interface DefaultValue {
  type: "generated" | "fixed";
  value: string | number | boolean | null;
  name: string | null;
}
