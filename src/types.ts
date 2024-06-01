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
