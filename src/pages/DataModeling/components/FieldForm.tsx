import React, {useEffect, useState} from "react";
import {Form, Input, Modal, Select, Switch} from "antd";
import {getModelList} from "../../../api/model"; // 替换为你的 API 调用
import {BasicFieldTypes, FieldInitialValues,} from "../common.ts";
import {useTranslation} from "react-i18next";
import FieldInput from "./FieldInput.tsx"; // 替换为你的组件
import {Field} from "../data";
import {ObjectType, ScalarType} from "../../../utils/type.ts";

interface FieldFormProps {
  visible: boolean;
  datasource: any;
  model: any;
  currentValue: any;
  onConfirm: (form: any) => void;
  onCancel: () => void;
}

const FieldForm: React.FC<FieldFormProps> = ({
                                               visible,
                                               datasource,
                                               model,
                                               currentValue,
                                               onConfirm,
                                               onCancel,
                                             }) => {
  const {t} = useTranslation();
  const [form] = Form.useForm();
  const [modelList, setModelList] = useState<any[]>([]);
  const [hasId, setHasId] = useState<boolean>(false);
  const [relationModel, setRelationModel] = useState<any>();
  const [tmpType, setTmpType] = useState<string>("");

  const initialValues = {
    name: "",
    type: "",
    concreteType: "",
    unique: false,
    nullable: false,
    identity: false,
    comment: "",
    multiple: false,
    defaultValue: null,
    from: "",
    tmpType: ScalarType.STRING,
    length: 255,
  };

  useEffect(() => {
    if (visible) {
      reqModelList();
      setHasId(model.fields?.some((f: any) => f.identity));
      console.log('xxxx',model.fields?.some((f: any) => f.identity));
    } else {
      form.resetFields();
    }
  }, [visible]);

  useEffect(() => {
    if (currentValue) {
      let tmpType = currentValue.type;
      if (currentValue.type === ScalarType.RELATION) {
        tmpType = `RELATION:${currentValue.from}`;
        setTmpType(`RELATION:${currentValue.from}`);
        if (!currentValue.localField) {
          form.setFieldValue(
            "localField",
            model.fields.filter((f: any) => f.type === "id")[0]?.name
          );
        }
      } else if (currentValue.type === ScalarType.ENUM) {
        tmpType = `ENUM:${currentValue.from}`;
      } else {
        setTmpType(currentValue.type);
      }
      form.setFieldsValue({
        ...currentValue,
        tmpType: tmpType,
      });
    }
  }, [currentValue]);

  useEffect(() => {
    if (tmpType.startsWith("RELATION")) {
      const relationName = tmpType.replace("RELATION:", "").replace("[]", "");
      const relatedModel = modelList.find((m) => m.name === relationName);
      setRelationModel(relatedModel);
      if (!currentValue.localField) {
        form.setFieldValue(
          "localField",
          model.fields.filter((f: any) => f.type === "ID")[0]?.name
        );
      }
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
    if (value.startsWith("RELATION")) {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: ScalarType.RELATION,
        from: value.replace("RELATION:", ""),
        multiple: false,
        defaultValue: undefined, // 清空默认值
      });
    } else if (value.startsWith("ENUM")) {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: ScalarType.ENUM,
        from: value.replace("ENUM:", ""),
        multiple: false,
        defaultValue: undefined, // 清空默认值
      });
    } else {
      form.setFieldsValue({
        ...FieldInitialValues[value],
        type: value,
        multiple: false,
        defaultValue: undefined, // 清空默认值
      });
    }
  };

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onConfirm(values);
    });
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
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      open={visible}
      onCancel={handleCancel}
      onOk={handleConfirm}
      title={currentValue?.name ? t("edit_field") : t("new_field")}
    >
      <Form
        form={form}
        onValuesChange={handleFormChange}
        labelCol={{span: 6}}
        wrapperCol={{span: 18}}
        layout="horizontal"
        initialValues={initialValues}
      >
        <Form.Item label={t("name")} name="name" rules={[{required: true}]}>
          <Input disabled={!!currentValue?.name}/>
        </Form.Item>
        <Form.Item label={t("comment")} name="comment">
          <Input/>
        </Form.Item>
        <Form.Item name="type" hidden>
          <Input/>
        </Form.Item>
        <Form.Item name="from" hidden>
          <Input/>
        </Form.Item>
        <Form.Item
          label={t("type")}
          name="tmpType"
          rules={[{required: true}]}
        >
          <Select value={tmpType} onChange={handleTypeChange}>
            <Select.OptGroup label={t("basic_field")}>
              {BasicFieldTypes.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.label}
                </Select.Option>
              ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("relation_field")}>
              {modelList
                .filter((item) => item.type === ObjectType.ENTITY)
                .map((item) => (
                  <Select.Option
                    key={item.name}
                    value={`RELATION:${item.name}`}
                  >
                    {item.name}
                  </Select.Option>
                ))}
            </Select.OptGroup>
            <Select.OptGroup label={t("enum_field")}>
              {modelList
                .filter((item) => item.type === ObjectType.ENUM)
                .map((item) => (
                  <Select.Option key={item.name} value={`ENUM:${item.name}`}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select.OptGroup>
          </Select>
        </Form.Item>

        {/* 以下是根据类型动态渲染的部分 */}
        {/*{form.getFieldValue("tmpType") === ScalarType.ID && (
          <Form.Item label="Generated value" name="generatedValue">
            <Select>
              {IDGeneratedValues.map((item) => (
                <Select.Option key={item.name} value={item.name}>
                  {item.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}*/}

        {form.getFieldValue("tmpType") === ScalarType.STRING && (
          <Form.Item label={t("length")} name="length">
            <Input type="number"/>
          </Form.Item>
        )}

        {form.getFieldValue("tmpType") === ScalarType.FLOAT && (
          <>
            <Form.Item label={t("precision")} name="precision">
              <Input type="number"/>
            </Form.Item>
            <Form.Item label={t("scale")} name="scale">
              <Input type="number"/>
            </Form.Item>
          </>
        )}

        {(form.getFieldValue("tmpType")?.startsWith("RELATION") || form.getFieldValue("tmpType") === ScalarType.RELATION) && (
          <>
            <Form.Item
              label={t("local_field")}
              name="localField"
              rules={[{required: true}]}
            >
              <Select>
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
              rules={[{required: true}]}
            >
              <Select>
                {relationModel?.fields?.map((field: any) => (
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
              <Switch/>
            </Form.Item>
            <Form.Item
              label={t("cascade_delete")}
              name="cascadeDelete"
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </>
        )}

        <Form.Item dependencies={["tmpType"]} noStyle>
          {({getFieldValue}) => {
            const tmpType = getFieldValue("tmpType");

            if (tmpType.startsWith("ENUM") || tmpType === ScalarType.ENUM) {
              return (
                <Form.Item
                  label={t("selection_multiple")}
                  name="multiple"
                  valuePropName="checked"
                >
                  <Switch/>
                </Form.Item>
              );
            }
          }}
        </Form.Item>

        {!(
          [ScalarType.RELATION].includes(form.getFieldValue("tmpType")) ||
          form.getFieldValue("tmpType")?.startsWith("RELATION")
        ) && (
          <>
            <Form.Item
              label={t("default_value")}
              name="defaultValue"
              shouldUpdate={(prevValues: Field, curValues) =>
                prevValues.defaultValue !== curValues.defaultValue
              }
            >
              <FieldInput
                fieldFn={() => form.getFieldsValue()}
                modelList={modelList}
                value={undefined}
                onChange={function (val: any): void {
                  console.log(val);
                }}
              />
            </Form.Item>
            <Form.Item
              label={t("identity_field")}
              name="identity"
              valuePropName="checked"
            >
              <Switch disabled={hasId}/>
            </Form.Item>
            <Form.Item
              label={t("nullable")}
              name="nullable"
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
            <Form.Item
              label={t("unique")}
              name="unique"
              valuePropName="checked"
            >
              <Switch/>
            </Form.Item>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default FieldForm;
