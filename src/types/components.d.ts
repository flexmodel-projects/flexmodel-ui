// 组件类型声明文件

declare module '@/components/explore/icons/Icons.jsx' {
  import {ReactElement} from 'react';

  export const ApiFolder: () => ReactElement;
  export const ApiMethodDelete: () => ReactElement;
  export const ApiMethodGet: () => ReactElement;
  export const ApiMethodPatch: () => ReactElement;
  export const ApiMethodPost: () => ReactElement;
  export const ApiMethodPut: () => ReactElement;
  export const IconEntityFolder: () => ReactElement;
  export const IconEnum: () => ReactElement;
  export const IconEnumFolder: () => ReactElement;
  export const IconFile: () => ReactElement;
  export const IconFolder: () => ReactElement;
  export const IconModel: () => ReactElement;
}

declare module '@/components/explore/explore/Tree.jsx' {
  import {ReactElement} from 'react';

  interface TreeProps {
    tree: {
      children: Array<{
        type: 'folder' | 'file';
        filename: string;
        path: string;
        children?: any[];
        data?: any;
        modelType?: string;
      }>;
    };
    selected: { path: string };
    onClickItem: (item: any) => void;
    renderMore?: (item: any) => ReactElement | null;
    renderIcon?: (item: any, nodeType: any) => ReactElement;
    compact?: boolean;
  }

  const Tree: React.FC<TreeProps>;
  export default Tree;
}
