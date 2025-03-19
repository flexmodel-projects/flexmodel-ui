import React from "react";
import {DatePicker, Input, InputNumber, Select, Switch, TimePicker} from "antd";
import dayjs from "dayjs";
import {Field} from "../data";
import {ScalarType} from "../../../utils/type.ts";

interface FieldInputProps {
  fieldFn: () => Field;
  editMode?: boolean;
  value: any;
  onChange: (val: any) => void;
  modelList?: any[];
}

const FieldInput: React.FC<FieldInputProps> = ({
  fieldFn,
  editMode = false,
  value,
  onChange,
  modelList = [],
}) => {
  const field = fieldFn();

  const renderInput = () => {
    switch (field.type) {
      case ScalarType.ID:
        return (
          <Input
            disabled={editMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case ScalarType.STRING:
        return (
          <Input
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case ScalarType.TEXT:
        return (
          <Input.TextArea
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case ScalarType.FLOAT:
      case ScalarType.INT:
      case ScalarType.LONG:
        return (
          <InputNumber
            placeholder={field.comment}
            value={value}
            onChange={(val) => onChange(val)}
            style={{ width: "100%" }}
          />
        );
      case ScalarType.BOOLEAN:
        return <Switch checked={value} onChange={(val) => onChange(val)} />;
      case ScalarType.DATETIME:
        return (
          <DatePicker
            showTime
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) =>
              onChange(date ? date.format("YYYY-MM-DD HH:mm:ss") : null)
            }
            style={{ width: "100%" }}
          />
        );
      case ScalarType.DATE:
        return (
          <DatePicker
            placeholder={field.comment}
            value={value ? dayjs(value) : null}
            onChange={(date) =>
              onChange(date ? date.format("YYYY-MM-DD") : null)
            }
            style={{ width: "100%" }}
          />
        );
      case ScalarType.TIME:
        return (
          <TimePicker
            placeholder={field.comment}
            value={value ? dayjs(value, 'HH:mm:ss') : null}
            onChange={(date) =>
              onChange(date ? date.format("HH:mm:ss") : null)
            }
            style={{ width: "100%" }}
          />
        );
      case ScalarType.JSON:
        return (
          <Input.TextArea
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case ScalarType.ENUM: {
        const fromEnum = modelList.find((m) => m.name === field.from);
        return (
          <Select
            mode={field?.multiple ? "multiple" : undefined}
            style={{ width: "100%" }}
            placeholder={field.comment}
            options={fromEnum.elements?.map((val: any) => ({
              value: val,
              label: val,
            }))}
            value={field.defaultValue}
            defaultValue={field.defaultValue}
            onChange={(e) => onChange(e)}
          />
        );
      }
      default:
        return (
          <Input value={value} onChange={(e) => onChange(e.target.value)} />
        );
    }
  };

  return <>{renderInput()}</>;
};

export default FieldInput;
