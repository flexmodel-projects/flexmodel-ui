import React from 'react';

// 创建 Context 替代旧的 Context API
export const SchemaContext = React.createContext({
  getOpenValue: () => true,  // 默认返回 true，使组件显示
  changeCustomValue: () => {},
  Model: {
    schema: {
      changeTypeAction: () => {},
      changeValueAction: () => {},
      changeNameAction: () => {},
      addChildFieldAction: () => {},
      addFieldAction: () => {},
      setOpenValueAction: () => {},
      deleteItemAction: () => {},
      enableRequireAction: () => {},
      requireAllAction: () => {}
    },
    __jsonSchemaFormat: [],
    __jsonSchemaMock: []
  },
  isMock: false
});

