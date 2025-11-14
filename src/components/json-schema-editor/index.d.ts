import React from 'react';

export interface JsonSchemaEditorConfig {
  lang?: 'zh_CN' | 'en_US';
  format?: Array<{ name: string }>;
  mock?: any;
}

export interface JsonSchemaEditorProps {
  data?: string;
  onChange?: (value: string) => void;
  showEditor?: boolean;
  isMock?: boolean;
}

declare function jeditor(config?: JsonSchemaEditorConfig): React.FC<JsonSchemaEditorProps>;

export default jeditor;

