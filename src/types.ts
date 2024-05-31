interface Datasource {
  id?: string;
  name: string;
  type: string;
  createTime: string;
  config: {
    dbName?: string;
    port?: number;
    host?: string;
    username?: string;
    password?: string;
  }
}
