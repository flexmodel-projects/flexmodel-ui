

// 定义 Tree 数据类型
export interface ApiInfo {
  id: string;
  name: string;
  type?: string;
  method?: string;
  children?: ApiInfo[];
  settingVisible?: boolean;
  data: any;
  meta: any;
  enabled: boolean;
}

export interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  settingVisible?: boolean;
  data: ApiInfo;
}
