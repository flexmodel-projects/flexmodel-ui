export interface Field {
  name: string;
  type: string;
  nullable?: boolean;
  comment?: string;
  generatedValue?: 'AUTO_INCREMENT' | 'BIGINT_NOT_GENERATED' | 'STRING_NOT_GENERATED';
}

export interface MRecord {
  [key: string]: any;
}

export interface RecordListProps {
  datasource: string;
  model: any; // Entity类型建议在实际使用时import
} 