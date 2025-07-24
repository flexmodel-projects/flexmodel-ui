import {FieldType} from "./data";
import type {IdP} from '../../types/data-modeling-common.d.ts';

import OIDC from "../../assets/icons/svg/idp_ocid.svg?react";

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
    label: 'String',
  },
  {
    name: 'TEXT',
    label: 'Text',
  },
  {
    name: 'INT',
    label: 'Int',
  },
  {
    name: 'BIGINT',
    label: 'Long',
  },
  {
    name: 'DECIMAL',
    label: 'Float',
  },
  {
    name: 'BOOLEAN',
    label: 'Boolean',
  },
  {
    name: 'DATETIME',
    label: 'DateTime',
  },
  {
    name: 'DATE',
    label: 'Date',
  },
  {
    name: 'JSON',
    label: 'JSON',
  },
];

export const FieldTypeMap: Record<string, string> = BasicFieldTypes.reduce((p, c) => {
  p[c.name] = c.label
  return p
}, {} as Record<string, string>);

export const FieldInitialValues: any = {
  STRING: {
    type: 'String',
    length: 255,
    unique: false,
    nullable: true,
  },
  TEXT: {
    type: 'Text',
    unique: false,
    nullable: true,
  },
  INT: {
    type: 'Int',
    unique: false,
    nullable: true,
  },
  LONG: {
    type: 'Long',
    unique: false,
    nullable: true,
  },
  DECIMAL: {
    type: 'Decimal',
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
  },
  BOOLEAN: {
    type: 'Boolean',
    unique: false,
    nullable: true,
  },
  DATE: {
    type: 'Date',
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
    type: 'Relation',
    multiple: true,
    localField: null,
    foreignField: null,
    unique: false,
    nullable: true,
    cascadeDelete: false
  },
}
