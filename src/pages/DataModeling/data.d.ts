
export interface Index {
  name: string;
  fields: { fieldName: string; direction: 'ASC' | 'DESC' }[];
  unique: boolean;
}
