import React from 'react';
import { Input, InputNumber, Switch, DatePicker } from 'antd';
import dayjs from 'dayjs';

interface FieldInputProps {
  field: {
    type: string;
    comment?: string;
  };
  editMode?: boolean;
  value: any;
  onChange: (val: any) => void;
}

const FieldInput: React.FC<FieldInputProps> = ({ field, editMode = false, value, onChange }) => {
  const renderInput = () => {
    switch (field.type) {
      case 'id':
        return <Input disabled={editMode} value={value} onChange={(e) => onChange(e.target.value)} />;
      case 'string':
        return <Input placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)} />;
      case 'text':
        return <Input.TextArea placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)} />;
      case 'decimal':
        return <InputNumber placeholder={field.comment} value={value} onChange={(val) => onChange(val)} style={{ width: '100%' }} />;
      case 'int':
        return <InputNumber placeholder={field.comment} value={value} onChange={(val) => onChange(val)} style={{ width: '100%' }} />;
      case 'bigint':
        return <Input placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)} />;
      case 'boolean':
        return <Switch checked={value} onChange={(val) => onChange(val)} />;
      case 'date':
        return (
          <DatePicker
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
            style={{ width: '100%' }}
          />
        );
      case 'datetime':
        return (
          <DatePicker
            showTime
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD HH:mm:ss') : null)}
            style={{ width: '100%' }}
          />
        );
      case 'json':
        return <Input.TextArea placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)} />;
      default:
        return <Input value={value} onChange={(e) => onChange(e.target.value)} />;
    }
  };

  return <>{renderInput()}</>;
};

export default FieldInput;
