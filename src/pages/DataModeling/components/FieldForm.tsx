import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select, Switch, theme} from "antd";
import {getModelList} from "../../../services/model.ts";
import {useTranslation} from "react-i18next";
import FieldInput from "./FieldInput.tsx";
import {Field} from "@/types/data-modeling";


interface FieldFormProps {
  visible: boolean;
  datasource: any;
  model: any;
  currentValue: any;
  onConfirm: (form: any) => void;
  onCancel: () => void;
}

// 字段类型常量
export const BasicFieldTypes = [
  {
    name: 'String',
    label: 'String',
  },
  {
    name: 'Int',
    label: 'Int',
  },
  {
    name: 'Long',
    label: 'Long',
  },
  {
    name: 'Float',
    label: 'Float',
  },
  {
    name: 'Boolean',
    label: 'Boolean',
  },
  {
    name: 'DateTime',
    label: 'DateTime',
  },
  {
    name: 'Date',
    label: 'Date',
  },
  {
    name: 'Time',
    label: 'Time',
  },
  {
    name: 'JSON',
    label: 'JSON',
  },
];

// 字段初始值常�?
export const FieldInitialValues: any = {
  STRING: {
    type: 'String',
    length: 255,
    unique: false,
    nullable: true,
  },
  INT: {
    type: 'Int',
    unique: false,
    nullable: true,
  },
  LONG: {
    type: 'Long',
    unique: false,
    nullable: true,
  },
  DECIMAL: {
    type: 'Decimal',
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
  },
  BOOLEAN: {
    type: 'Boolean',
    unique: false,
    nullable: true,
  },
  DATE: {
    type: 'Date',
    unique: false,
    nullable: true,
  },
  TIME: {
    type: 'Time',
    unique: false,
    nullable: true,
  },
  DATETIME: {
    type: 'DateTime',
    unique: false,
    nullable: true,
  },
  JSON: {
    type: 'JSON',
    unique: false,
    nullable: true,
  },
  RELATION: {
    type: 'Relation',
    multiple: true,
    localField: null,
    foreignField: null,
    unique: false,
    nullable: true,
    cascadeDelete: false
  },
};

const FieldForm: React.FC<FieldFormProps> = ({
  visible,
  datasource,
  model,
  currentValue,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [form] = Form.useForm();
  const [modelList, setModelList] = useState<any[]>([]);
  const [RelationModel, setRelationModel] = useState<any>();
  const [tmpType, setTmpType] = useState<string>("");

  const initialValues = {
    name: "",
    type: "",
    concreteType: "",
    unique: false,
    nullable: false,
    comment: "",
    defaultValue: undefined,
    length: 255,
    precision: 20,
    scale: 2,
    multiple: false,
    localField: null,
    foreignField: null,
    cascadeDelete: false,
    from: "",
    tmpType: "",
  };

  useEffect(() => {
    if (visible) {
      reqModelList();
      if (currentValue) {
        form.setFieldsValue(currentValue);
        setTmpType(currentValue.tmpType || currentValue.type);
      } else {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, currentValue]);

  useEffect(() => {
    if (tmpType?.startsWith("Relation:")) {
      const relatedModelName = tmpType.replace("Relation:", "");
      const relatedModel = modelList.find((m) => m.name === relatedModelName);
      setRelationModel(relatedModel);
    } else {
      setRelationModel(null);
    }
  }, [modelList, tmpType]);

  const reqModelList = async () => {
    const data = await getModelList(datasource);
    setModelList(data);
  };

  const handleTypeChange = (value: string) => {
    setTmpType(value);
    console.log("----");
    if (value.startsWith("Relation")) {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: "Relation",
        from: value.replace("Relation:", ""),
        multiple: false,
        defaultValue: undefined, // 清空默认�?
      });
    } else if (value.startsWith("Enum")) {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: "Enum",
        from: value.replace("Enum:", ""),
        multiple: false,
        defaultValue: undefined, // 清空默认�?
      })
    } else {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: value,
        multiple: false,
        defaultValue: undefined, // 清空默认�?
      });
    }
  };

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onConfirm(values);
    });
  };

  // 处理表单值变�?
  const handleFormChange = (
    changedValues: Partial<Field>,
    allValues: Field
  ) => {
    if ("multiple" in changedValues) {
      // 如果有默认值的情况下才进行处理
      if (
        allValues.defaultValue !== undefined &&
        allValues.defaultValue !== null
      ) {
        if (changedValues.multiple) {
          // 切换到multiple时，将单个值转换为数组
          const _defaultValue = Array.isArray(allValues.defaultValue)
            ? allValues.defaultValue
            : [allValues.defaultValue];

          form.setFieldsValue({
            defaultValue: _defaultValue,
          });
        } else {
          // 切换到非multiple时，取数组的第一个值，并确保重置表单状�?
          const _defaultValue = Array.isArray(allValues.defaultValue)
            ? allValues.defaultValue[0]
            : allValues.defaultValue;

          form.setFieldsValue({
            defaultValue: _defaultValue,
          });
        }
      }
    }
  };

  // 紧凑主题样式
  const formStyle = {
    
  };

  const inputStyle = {
    fontSize: token.fontSizeSM,
  };

  const selectStyle = {
    fontSize: token.fontSizeSM,
  };

  return (
    <Modal
      title={t("field_form_title")}
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleFormChange}
        style={formStyle}
      >
        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input size="small" style={inputStyle} />
        </Form.Item>
        <Form.Item name="comment" label={t("comment")}>
          <Input size="small" style={inputStyle} />
        </Form.Item>
        <Form.Item name="type" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="from" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label={t("type")}
          name="tmpType"
          rules={[{ required: true }]}
        >
          <Select value={tmpType} onChange={handleTypeChange} size="small" style={selectStyle}>
            <Select.OptGroup label={t("select_group_basic_field")}>
              {BasicFieldTypes.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.label}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("select_group_Relation")}>
              {modelList
                .filter((item) => item.type === "ENTITY")
                .map((item) => (
                  <Select.Option
                    key={item.name}
                    value={`Relation:${item.name}`}
                  >
                    {item.name}
                  </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("select_group_Enumeration")}>
              {modelList
                .filter((item) => item.type === "Enum")
                .map((item) => (
                  <Select.Option key={item.name} value={`Enum:${item.name}`}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {form.getFieldValue("tmpType") === "String" && (
          <Form.Item label={t("length")} name="length">
            <Input type="number" size="small" style={inputStyle} />
          </Form.Item>
        )}

        {form.getFieldValue("tmpType") === "Decimal" && (
          <>
            <Form.Item label={t("precision")} name="precision">
              <Input type="number" size="small" style={inputStyle} />
            </Form.Item>
            <Form.Item label={t("scale")} name="scale">
              <Input type="number" size="small" style={inputStyle} />
            </Form.Item>
          </>
        )}

        {form.getFieldValue("tmpType")?.startsWith("Relation") && (
          <>
            <Form.Item
              label={t("local_field")}
              name="localField"
              rules={[{ required: true }]}
            >
              <Select size="small" style={selectStyle}>
                {model?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("foreign_field")}
              name="foreignField"
              rules={[{ required: true }]}
            >
              <Select size="small" style={selectStyle}>
                {RelationModel?.fields?.map((field: any) => (
                  <Select.Option key={field.name} value={field.name}>
                    {field.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("selection_multiple")}
              name="multiple"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
            <Form.Item
              label={t("cascade_delete")}
              name="cascadeDelete"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </>
        )}

        <Form.Item label={t("unique")} name="unique" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label={t("nullable")} name="nullable" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label={t("default_value")} name="defaultValue">
          <FieldInput
            fieldFn={() => form.getFieldsValue()}
            value={form.getFieldValue("defaultValue")}
            onChange={(val) => form.setFieldsValue({ defaultValue: val })}
            modelList={modelList}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FieldForm;

