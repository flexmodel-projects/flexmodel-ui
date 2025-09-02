import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select, Switch, theme} from "antd";
import {getModelList} from "@/services/model.ts";
import {useTranslation} from "react-i18next";
import DefaultValueInput from "./DefaultValueInput";
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

// 字段初始值常量
export const FieldInitialValues: any = {
  STRING: {
    type: 'String',
    length: 255,
    unique: false,
    nullable: true,
    identity: false,
  },
  INT: {
    type: 'Int',
    unique: false,
    nullable: true,
    identity: false,
  },
  LONG: {
    type: 'Long',
    unique: false,
    nullable: true,
    identity: false,
  },
  DECIMAL: {
    type: 'Decimal',
    precision: 20,
    scale: 2,
    unique: false,
    nullable: true,
    identity: false,
  },
  BOOLEAN: {
    type: 'Boolean',
    unique: false,
    nullable: true,
    identity: false,
  },
  DATE: {
    type: 'Date',
    unique: false,
    nullable: true,
    identity: false,
  },
  TIME: {
    type: 'Time',
    unique: false,
    nullable: true,
    identity: false,
  },
  DATETIME: {
    type: 'DateTime',
    unique: false,
    nullable: true,
    identity: false,
  },
  JSON: {
    type: 'JSON',
    unique: false,
    nullable: true,
    identity: false,
  },
  RELATION: {
    type: 'Relation',
    multiple: true,
    localField: null,
    foreignField: null,
    unique: false,
    nullable: true,
    cascadeDelete: false,
    identity: false,
  },
  ENUM: {
    type: 'Enum',
    unique: false,
    nullable: true,
    multiple: false,
    identity: false,
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
    type: "String",
    concreteType: "String",
    unique: false,
    nullable: true,
    comment: "",
    defaultValue: { type: "fixed", value: null },
    length: 255,
    precision: 20,
    scale: 2,
    multiple: false,
    localField: null,
    foreignField: null,
    cascadeDelete: false,
    from: "",
    tmpType: "String",
  };

  useEffect(() => {
    if (visible) {
      reqModelList();
      if (currentValue && Object.keys(currentValue).length > 0) {
        // 编辑现有字段时，设置表单值
        form.setFieldsValue(currentValue);
        // 根据字段类型正确设置tmpType
        let tmpTypeValue = currentValue.tmpType;
        if (!tmpTypeValue) {
          if (currentValue.type === 'Relation' && currentValue.from) {
            tmpTypeValue = `Relation:${currentValue.from}`;
          } else if (currentValue.type === 'Enum' && currentValue.from) {
            tmpTypeValue = `Enum:${currentValue.from}`;
          } else {
            tmpTypeValue = currentValue.type;
          }
        }
        setTmpType(tmpTypeValue);
      } else {
        // 创建新字段时，清空表单并设置初始值
        form.setFieldsValue(initialValues);
        setTmpType("String");
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
    console.log('ModelList data:', data);
    console.log('Enum models:', data.filter(item => item.type === "enum"));
    setModelList(data);
  };

  const handleTypeChange = (value: string) => {
    setTmpType(value);
    console.log("----");
    if (value.startsWith("Relation")) {
      form.setFieldsValue({
        ...FieldInitialValues["RELATION"],
        type: "Relation",
        from: value.replace("Relation:", ""),
        multiple: false,
        defaultValue: { type: "fixed", value: null }, // 重置默认值
      });
    } else if (value.startsWith("Enum")) {
      form.setFieldsValue({
        ...FieldInitialValues["ENUM"],
        type: "EnumRef",
        from: value.replace("Enum:", ""),
        defaultValue: { type: "fixed", value: null }, // 重置默认值
      })
    } else {
      form.setFieldsValue({
        ...FieldInitialValues[value.toUpperCase()],
        type: value,
        multiple: false,
        defaultValue: { type: "fixed", value: null }, // 重置默认值
      });
    }
  };

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      if (values.defaultValue?.name === null && values.defaultValue?.value === null) {
        values.defaultValue = null;
      }
      onConfirm(values);
    });
  };

  // 处理表单取消
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 处理表单值变化
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
          // 切换到非multiple时，取数组的第一个值，并确保重置表单状态
          const _defaultValue = Array.isArray(allValues.defaultValue)
            ? allValues.defaultValue[0]
            : allValues.defaultValue;

          form.setFieldsValue({
            defaultValue: _defaultValue,
          });
        }
      }
    }

    // 处理identity字段变化
    if ("identity" in changedValues && changedValues.identity === true) {
      // 当设置当前字段为identity时，需要通知父组件更新其他字段的identity状态
      // 这里可以通过回调函数通知父组件
      console.log("Field set as identity:", allValues.name);
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
      onCancel={handleCancel}
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
          <Input style={inputStyle} />
        </Form.Item>
        <Form.Item name="comment" label={t("comment")}>
          <Input style={inputStyle} />
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
          <Select onChange={handleTypeChange} style={selectStyle}>
            <Select.OptGroup label={t("select_group_basic_field")}>
              {BasicFieldTypes.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.label}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("select_group_relation")}>
              {modelList
                .filter((item) => item.type === "entity")
                .map((item) => (
                  <Select.Option
                    key={item.name}
                    value={`Relation:${item.name}`}
                  >
                    {item.name}
                  </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("select_group_enumeration")}>
              {(() => {
                const enumModels = modelList.filter((item) => item.type === "enum");
                console.log('Enum models found:', enumModels.length, enumModels);
                return enumModels.map((item) => (
                  <Select.Option key={item.name} value={`Enum:${item.name}`}>
                    {item.name}
                  </Select.Option>
                ));
              })()}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {form.getFieldValue("tmpType") === "String" && (
          <Form.Item label={t("length")} name="length">
            <Input type="number" style={inputStyle} />
          </Form.Item>
        )}

        {form.getFieldValue("tmpType") === "Decimal" && (
          <>
            <Form.Item label={t("precision")} name="precision">
              <Input type="number" style={inputStyle} />
            </Form.Item>
            <Form.Item label={t("scale")} name="scale">
              <Input type="number" style={inputStyle} />
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
              <Select style={selectStyle}>
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
              <Select style={selectStyle}>
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

        {form.getFieldValue("tmpType")?.startsWith("Enum") && (
          <>
            <Form.Item
              label={t("selection_multiple")}
              name="multiple"
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
        <Form.Item label={t("identity")} name="identity" valuePropName="checked">
          <Switch
            disabled={(() => {
              // 检查当前字段是否已经是identity
              const currentFieldName = form.getFieldValue("name");
              const currentIdentity = form.getFieldValue("identity");

              // 如果当前字段已经是identity，则不禁用
              if (currentIdentity) {
                return false;
              }

              // 检查其他字段是否已经是identity
              const existingIdentityField = model?.fields?.find((field: any) =>
                field.identity === true && field.name !== currentFieldName
              );

              return !!existingIdentityField;
            })()}
          />
        </Form.Item>
        <Form.Item label={t("default_value")} name="defaultValue">
          <DefaultValueInput
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

