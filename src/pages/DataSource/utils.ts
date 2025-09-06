import type {DatasourceSchema} from "@/types/data-source";

/**
 * 标准化数据源对象，将嵌套的配置展开为扁平结构
 */
export const normalizeDatasource = (datasource: DatasourceSchema): any => {
  return {
    name: datasource.name,
    type: datasource.type,
    createdAt: datasource.createdAt,
    updatedAt: datasource.updatedAt,
    // 展开配置对象
    ...datasource.config,
  };
};

/**
 * 构建更新数据源的载荷
 */
export const buildUpdatePayload = (formData: any): Partial<DatasourceSchema> => {
  const { name, type, createdAt, updatedAt, ...config } = formData;
  
  return {
    name,
    type: type || "USER",
    config,
    enabled: true, // 默认启用
    createdAt: createdAt || "",
    updatedAt: updatedAt || "",
  };
};

/**
 * 合并数据源对象，用于更新后的状态同步
 */
export const mergeDatasource = (original: DatasourceSchema, updates: any): DatasourceSchema => {
  return {
    ...original,
    ...updates,
    config: {
      ...original.config,
      ...updates.config,
    },
  };
};

/**
 * 验证数据源配置
 */
export const validateDatasourceConfig = (config: any, t: (key: string) => string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!config.dbKind) {
    errors.push(t("database_type_required"));
  }
  
  if (!config.url) {
    errors.push(t("database_url_required"));
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * 获取数据库类型的显示名称
 */
export const getDatabaseTypeDisplayName = (dbKind: string): string => {
  const typeMap: Record<string, string> = {
    mysql: "MySQL",
    mariadb: "MariaDB",
    oracle: "Oracle",
    sqlserver: "SQL Server",
    postgresql: "PostgreSQL",
    db2: "DB2",
    sqlite: "SQLite",
    gbase: "GBase",
    dm: "DM8",
    tidb: "TiDB",
    mongodb: "MongoDB",
  };
  
  return typeMap[dbKind] || dbKind;
};
