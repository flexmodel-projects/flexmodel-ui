import MySQL from "../../assets/icons/svg/mysql.svg?react";
import MariaDB from "../../assets/icons/svg/mariadb.svg?react";
import Oracle from "../../assets/icons/svg/oracle.svg?react";
import SqlServer from "../../assets/icons/svg/sqlserver.svg?react";
import PostgreSQL from "../../assets/icons/svg/postgresql.svg?react";
import DB2 from "../../assets/icons/svg/db2.svg?react";
import SQLite from "../../assets/icons/svg/sqlite.svg?react";
import GBase from "../../assets/icons/svg/gbase.svg?react";
import DM8 from "../../assets/icons/svg/dm.svg?react";
import TiDB from "../../assets/icons/svg/tidb.svg?react";
import MongoDB from "../../assets/icons/svg/mongodb.svg?react";
import type {Db} from '../../types/data-source.d.ts';

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
export const DbsMap: Record<string, any> = Dbs.reduce((p, c) => {
  p[c.name] = c.icon
  return p
}, {} as Record<string, string>);
