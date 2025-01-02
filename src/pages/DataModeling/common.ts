import {Endpoint, FieldType} from "./data";
import REST_API from "../../assets/icons/design_restapi.svg?react";
import GraphQL from "../../assets/icons/design_graphql.svg?react";
import gRPC from "../../assets/icons/design_grpc.svg?react";
import WebSocket from "../../assets/icons/design_websocket.svg?react";
import MQTT from "../../assets/icons/design_mqtt.svg?react";

import OIDC from "../../assets/icons/svg/idp_ocid.svg?react";

export const Endpoints: Endpoint[] = [
  {name: 'REST API', type: 'REST_API', icon: REST_API, enable: true},
  {name: 'GraphQL', type: 'GRAPH_QL', icon: GraphQL, enable: true},
  {name: 'gRPC', type: 'GRPC', icon: gRPC, enable: false},
  {name: 'WebSocket', type: 'WEB_SOCKET', icon: WebSocket, enable: false},
  {name: 'MQTT', type: 'MQTT', icon: MQTT, enable: false},
]

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
    name: 'string',
    label: 'String',
  },
  {
    name: 'text',
    label: 'Text',
  },

  {
    name: 'int',
    label: 'Int',
  },
  {
    name: 'bigint',
    label: 'BigInt',
  },
  {
    name: 'decimal',
    label: 'Decimal',
  },
  {
    name: 'boolean',
    label: 'Boolean',
  },
  {
    name: 'datetime',
    label: 'DateTime',
  },
  {
    name: 'date',
    label: 'Date',
  },
  {
    name: 'json',
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
  string: {
    type: 'string',
    length: 255,
    unique: false,
    nullable: true,
  },
  text: {
    type: 'text',
    unique: false,
    nullable: true,
  },
  int: {
    type: 'int',
    unique: false,
    nullable: true,
  },
  bigint: {
    type: 'bigint',
    unique: false,
    nullable: true,
  },
  decimal: {
    type: 'decimal',
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
  },
  boolean: {
    type: 'boolean',
    unique: false,
    nullable: true,
  },
  date: {
    type: 'date',
    unique: false,
    nullable: true,
  },
  json: {
    type: 'json',
    unique: false,
    nullable: true,
  },
  id: {
    type: 'id',
    generatedValue: 'AUTO_INCREMENT',
    unique: true,
    nullable: true,
  },
  relation: {
    type: 'relation',
    cardinality: 'ONE_TO_ONE',
    targetField: null,
    unique: false,
    nullable: true,
  },
}
