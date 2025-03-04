import {FieldType} from "./data";

import OIDC from "../../assets/icons/svg/idp_ocid.svg?react";

export type IdP = { name: string; icon: any; }

export const IdPs: IdP[] = [
  {
    name: 'oidc',
    icon: OIDC,
  }
];

export const IdpMap: Record<string, string> = IdPs.reduce((p, c) => {
  p[c.name] = c.icon
  return p
}, {} as Record<string, string>)


export const BasicFieldTypes: FieldType[] = [
  {
    name: 'STRING',
    label: 'STRING',
  },
  {
    name: 'TEXT',
    label: 'TEXT',
  },

  {
    name: 'INT',
    label: 'INT',
  },
  {
    name: 'BIGINT',
    label: 'BIGINT',
  },
  {
    name: 'DECIMAL',
    label: 'DECIMAL',
  },
  {
    name: 'BOOLEAN',
    label: 'BOOLEAN',
  },
  {
    name: 'DATETIME',
    label: 'DATETIME',
  },
  {
    name: 'DATE',
    label: 'DATE',
  },
  {
    name: 'JSON',
    label: 'JSON',
  },
]

export const FieldTypeMap: Record<string, string> = BasicFieldTypes.reduce((p, c) => {
  p[c.name] = c.label
  return p
}, {} as Record<string, string>);

export const IDGeneratedValues: any[] = [
  {
    name: 'AUTO_INCREMENT',
    label: 'Auto increment',
  },
  {
    name: 'UUID',
    label: 'UUID',
  },
  {
    name: 'ULID',
    label: 'ULID',
  },
  {
    name: 'BIGINT_NOT_GENERATED',
    label: 'Bigint not generated',
  },
  {
    name: 'STRING_NOT_GENERATED',
    label: 'String not generated',
  }
]

export const FieldInitialValues: any = {
  STRING: {
    type: 'STRING',
    length: 255,
    unique: false,
    nullable: true,
  },
  TEXT: {
    type: 'TEXT',
    unique: false,
    nullable: true,
  },
  INT: {
    type: 'INT',
    unique: false,
    nullable: true,
  },
  BIGINT: {
    type: 'BIGINT',
    unique: false,
    nullable: true,
  },
  DECIMAL: {
    type: 'DECIMAL',
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
  },
  BOOLEAN: {
    type: 'BOOLEAN',
    unique: false,
    nullable: true,
  },
  DATE: {
    type: 'DATE',
    unique: false,
    nullable: true,
  },
  JSON: {
    type: 'JSON',
    unique: false,
    nullable: true,
  },
  ID: {
    type: 'ID',
    generatedValue: 'AUTO_INCREMENT',
    unique: true,
    nullable: true,
  },
  RELATION: {
    type: 'RELATION',
    multiple: true,
    localField: null,
    foreignField: null,
    unique: false,
    nullable: true,
    cascadeDelete: false
  },
}
