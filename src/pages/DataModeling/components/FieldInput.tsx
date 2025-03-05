import React from "react";
import { DatePicker, Input, InputNumber, Select, Switch } from "antd";
import dayjs from "dayjs";
import { Field } from "../data";

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
      case "ID":
        return (
          <Input
            disabled={editMode}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "STRING":
        return (
          <Input
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "TEXT":
        return (
          <Input.TextArea
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "DECIMAL":
      case "INT":
      case "BIGINT":
        return (
          <InputNumber
            placeholder={field.comment}
            value={value}
            onChange={(val) => onChange(val)}
            style={{ width: "100%" }}
          />
        );
      case "BOOLEAN":
        return <Switch checked={value} onChange={(val) => onChange(val)} />;
      case "DATE":
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
      case "DATETIME":
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
      case "JSON":
        return (
          <Input.TextArea
            placeholder={field.comment}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case "ENUM": {
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
