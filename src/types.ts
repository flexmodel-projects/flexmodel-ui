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

interface Datasource {
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

export type Endpoint = { name: string; type: string; icon: string; enable: boolean }
export const Endpoints: Endpoint[] = [
  {name: 'REST API', type: 'REST_API', icon: REST_API, enable: true},
  {name: 'GraphQL', type: 'GRAPH_QL', icon: GraphQL, enable: false},
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
