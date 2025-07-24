// 假设data-modeling.d.ts有MRecord，如果没有，可以在这里定义或导入

// 已经存在PagedResult<T>
export interface PagedResult<T> {
  list: T[];
  total: number;
}
