import React from 'react';
import {DatePicker, Input, InputNumber, Select, Switch} from 'antd';
import dayjs from 'dayjs';
import {Field} from "../data";

interface FieldInputProps {
  field: Field;
  editMode?: boolean;
  value: any;
  onChange: (val: any) => void;
  modelList?: any[];
}

const FieldInput: React.FC<FieldInputProps> = ({field, editMode = false, value, onChange, modelList = []}) => {
  const renderInput = () => {
    switch (field.type) {
      case 'id':
        return <Input disabled={editMode} value={value} onChange={(e) => onChange(e.target.value)}/>;
      case 'string':
        return <Input placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)}/>;
      case 'text':
        return <Input.TextArea placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)}/>;
      case 'decimal':
      case 'int':
      case 'bigint':
        return <InputNumber placeholder={field.comment} value={value} onChange={(val) => onChange(val)}
                            style={{width: '100%'}}/>;
      case 'boolean':
        return <Switch checked={value} onChange={(val) => onChange(val)}/>;
      case 'date':
        return (
          <DatePicker
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD') : null)}
            style={{width: '100%'}}
          />
        );
      case 'datetime':
        return (
          <DatePicker
            showTime
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) => onChange(date ? date.format('YYYY-MM-DD HH:mm:ss') : null)}
            style={{width: '100%'}}
          />
        );
      case 'json':
        return <Input.TextArea placeholder={field.comment} value={value} onChange={(e) => onChange(e.target.value)}/>;
      case 'enum': {
        const fromEnum = modelList.find(m => m.name === field.from);
        return <Select
          mode={field?.multiple ? 'multiple' : undefined}
          style={{width: '100%'}}
          placeholder={field.comment}
          options={fromEnum.elements?.map((val: any) => ({
            value: val,
            label: val,
          }))}
          defaultValue={field.defaultValue}
        />;
      }
      default:
        return <Input value={value} onChange={(e) => onChange(e.target.value)}/>;
    }
  };

  return <>{renderInput()}</>;
};

export default FieldInput;
