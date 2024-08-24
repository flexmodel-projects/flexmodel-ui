import REST_API from "~/assets/icons/design_restapi.svg";
import GraphQL from "~/assets/icons/design_graphql.svg";
import gRPC from "~/assets/icons/design_grpc.svg";
import WebSocket from "~/assets/icons/design_websocket.svg";
import MQTT from "~/assets/icons/design_mqtt.svg";

import MySQL from "~/assets/icons/svg/mysql.svg";
import MariaDB from "~/assets/icons/svg/mariadb.svg";
import Oracle from "~/assets/icons/svg/oracle.svg";
import SqlServer from "~/assets/icons/svg/sqlserver.svg";
import PostgreSQL from "~/assets/icons/svg/postgresql.svg";
import DB2 from "~/assets/icons/svg/db2.svg";
import SQLite from "~/assets/icons/svg/sqlite.svg";
import GBase from "~/assets/icons/svg/gbase.svg";
import DM8 from "~/assets/icons/svg/dm.svg";
import TiDB from "~/assets/icons/svg/tidb.svg";
import MongoDB from "~/assets/icons/svg/mongodb.svg";

import OIDC from "~/assets/icons/svg/idp_ocid.svg";

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


export type Endpoint = { name: string; type: string; icon: string; enable: boolean }
export const Endpoints: Endpoint[] = [
  {name: 'REST API', type: 'REST_API', icon: REST_API, enable: true},
  {name: 'GraphQL', type: 'GRAPH_QL', icon: GraphQL, enable: true},
  {name: 'gRPC', type: 'GRPC', icon: gRPC, enable: false},
  {name: 'WebSocket', type: 'WEB_SOCKET', icon: WebSocket, enable: false},
  {name: 'MQTT', type: 'MQTT', icon: MQTT, enable: false},
]
export type Db = { name: string; icon: string; }

export const Dbs: Db[] = [
  {
    name: "mysql",
    icon: MySQL,
  },
  {
    name: "mariadb",
    icon: MariaDB,
  },
  {
    name: "oracle",
    icon: Oracle,
  },
  {
    name: "sqlserver",
    icon: SqlServer,
  },
  {
    name: "postgresql",
    icon: PostgreSQL,
  },
  {
    name: "db2",
    icon: DB2,
  },
  {
    name: "sqlite",
    icon: SQLite,
  },
  {
    name: "gbase",
    icon: GBase,
  },
  {
    name: "dm",
    icon: DM8,
  },
  {
    name: "tidb",
    icon: TiDB,
  },
  {
    name: "mongodb",
    icon: MongoDB,
  }
]

export const DbsMap: Record<string, string> = Dbs.reduce((p, c) => {
  p[c.name] = c.icon
  return p
}, {} as Record<string, string>)

export type IdP = { name: string; icon: string; }

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

export type FieldType = { name: string; label: string; }

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
    label: 'Bigint',
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
    label: 'Datetime',
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

export const GeneratorTypes: any = {
  string: [
    {
      name: 'FixedValueGenerator',
      label: 'Fixed value'
    },
    {
      name: 'UUIDValueGenerator',
      label: 'UUID'
    },
    {
      name: 'ULIDValueGenerator',
      label: 'ULID'
    }
  ],
  text: [],
  int: [{
    name: 'FixedValueGenerator',
    label: 'Fixed value'
  }],
  bigint: [{
    name: 'FixedValueGenerator',
    label: 'Fixed value'
  }],
  decimal: [{
    name: 'FixedValueGenerator',
    label: 'Fixed value'
  }],
  boolean: [{
    name: 'FixedValueGenerator',
    label: 'Fixed value'
  }],
  datetime: [
    {
      name: 'FixedValueGenerator',
      label: 'Fixed value'
    },
    {
      name: 'DatetimeNowValueGenerator',
      label: 'Now value'
    },
  ],
  date: [
    {
      name: 'FixedValueGenerator',
      label: 'Fixed value'
    },
    {
      name: 'DateNowValueGenerator',
      label: 'Now value'
    },
  ],
  json: []
};

export const GenerationTimes: { name: string, label: string }[] = [
  {
    name: 'INSERT',
    label: 'Insert'
  },
  {
    name: 'UPDATE',
    label: 'Update'
  },
  {
    name: 'ALWAYS',
    label: 'Always'
  },
]

export const ValidatorTypes: any = {
  string: [
    {
      name: 'URLValidator',
      label: 'URL'
    },
    {
      name: 'EmailValidator',
      label: 'Email'
    },
    {
      name: 'RegexpValidator',
      label: 'RegExp'
    },
  ],
  text: [],
  int: [
    {
      name: 'NumberMinValidator',
      label: 'Min'
    },
    {
      name: 'NumberMaxValidator',
      label: 'Max'
    },
    {
      name: 'NumberRangeValidator',
      label: 'Range'
    }
  ],
  bigint: [
    {
      name: 'NumberMinValidator',
      label: 'Min'
    },
    {
      name: 'NumberMaxValidator',
      label: 'Max'
    },
    {
      name: 'NumberRangeValidator',
      label: 'Range'
    }
  ],
  decimal: [
    {
      name: 'NumberMinValidator',
      label: 'Min'
    },
    {
      name: 'NumberMaxValidator',
      label: 'Max'
    },
    {
      name: 'NumberRangeValidator',
      label: 'Range'
    }
  ],
  boolean: [],
  datetime: [
    {
      name: 'DatetimeMaxValidator',
      label: 'Max'
    },
    {
      name: 'DatetimeMaxValidator',
      label: 'Min'
    },
    {
      name: 'DatetimeRangeValidator',
      label: 'Range'
    },
  ],
  date: [
    {
      name: 'DateMaxValidator',
      label: 'Max'
    },
    {
      name: 'DateMaxValidator',
      label: 'Min'
    },
    {
      name: 'DateRangeValidator',
      label: 'Range'
    },
  ],
  json: []
};

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
