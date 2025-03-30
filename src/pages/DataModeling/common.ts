import {FieldType} from "./data";

import OIDC from "../../assets/icons/svg/idp_ocid.svg?react";
import {ScalarType} from "../../utils/type.ts";

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
    name: ScalarType.STRING,
    label: 'String',
  },
  {
    name: ScalarType.INT,
    label: 'Int',
  },
  {
    name: ScalarType.LONG,
    label: 'Long',
  },
  {
    name: ScalarType.FLOAT,
    label: 'Float',
  },
  {
    name: ScalarType.BOOLEAN,
    label: 'Boolean',
  },
  {
    name: ScalarType.DATETIME,
    label: 'DateTime',
  },
  {
    name: ScalarType.DATE,
    label: 'Date',
  },
  {
    name: ScalarType.TIME,
    label: 'Time',
  },
  {
    name: ScalarType.JSON,
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
  String: {
    type: ScalarType.STRING,
    length: 255,
    unique: false,
    nullable: true,
  },
  Int: {
    type: ScalarType.INT,
    unique: false,
    nullable: true,
  },
  Long: {
    type: ScalarType.LONG,
    unique: false,
    nullable: true,
  },
  Float: {
    type: ScalarType.FLOAT,
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
  },
  Boolean: {
    type: ScalarType.BOOLEAN,
    unique: false,
    nullable: true,
  },
  DateTime: {
    type: ScalarType.DATETIME,
    unique: false,
    nullable: true,
  },
  Date: {
    type: ScalarType.DATE,
    unique: false,
    nullable: true,
  },
  Time: {
    type: ScalarType.TIME,
    unique: false,
    nullable: true,
  },
  JSON: {
    type: ScalarType.JSON,
    unique: false,
    nullable: true,
  },
  ID: {
    type: ScalarType.ID,
    generatedValue: 'AUTO_INCREMENT',
    unique: true,
    nullable: true,
  },
  Relation: {
    type: ScalarType.RELATION,
    multiple: true,
    localField: null,
    foreignField: null,
    unique: false,
    nullable: true,
    cascadeDelete: false
  },
}
