import React from 'react';

export interface JsonSchemaEditorProps {
  data?: string;
  onChange?: (value: string) => void;
  showEditor?: boolean;
  isMock?: boolean;
}

export interface JsonSchemaEditorComponentProps extends JsonSchemaEditorProps {
  lang?: 'zh_CN' | 'en_US';
  format?: Array<{ name: string }>;
  mock?: any;
}

declare const JsonSchemaEditor: React.FC<JsonSchemaEditorComponentProps>;

export default JsonSchemaEditor;

