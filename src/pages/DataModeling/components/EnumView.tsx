import React, {useEffect} from "react";
import {Button, Form, Input, Space} from "antd";
import {useTranslation} from "react-i18next";
import type {Enum} from "../data";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";

interface EnumViewProps {
  datasource: string;
  model?: Partial<Enum>;
  onConfirm: (model: Enum) => void;
}

const EnumView: React.FC<EnumViewProps> = ({model, onConfirm}) => {
  const {t} = useTranslation();

  const [form] = Form.useForm();

  useEffect(() => {
    if (model) {
      form.setFieldsValue(model);
    }
  }, [model, form]);

  const handleSave = async () => {
    try {
      await form.validateFields();
      onConfirm({
        name: form.getFieldValue("name"),
        type: "ENUM",
        elements: form.getFieldValue("elements"),
        comment: form.getFieldValue("comment"),
      });
    } catch (error) {
      console.error("Validation failed", error);
    }
  };

  return (
    <>
      <Form form={form} initialValues={model} layout="vertical">
        <Form.Item name="name" label={t("name")} rules={[{required: true}]}>
          <Input disabled={!!model}/>
        </Form.Item>
        <Form.Item name="comment" label={t("comment")} rules={[{required: true}]}>
          <Input/>
        </Form.Item>
        <Form.List
          name="elements"
          rules={[
            {
              validator: async (_, names) => {
                if (!names || names.length < 2) {
                  return Promise.reject(new Error(t('enum_element_size_valid')));
                }
              },
            },
          ]}
        >
          {(fields, {add, remove}, {errors}) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? t("elements") : ''}
                  required={false}
                  key={field.key}
                >
                  <Form.Item
                    {...field}
                    validateTrigger={['onChange', 'onBlur']}
                    noStyle
                  >
                    <Input style={{width: '60%'}}/>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Space>
                  <Button
                    type="dashed"
                    onClick={() => {

                      add('', 0);
                    }}
                    icon={<PlusOutlined/>}
                  >
                    {t('add_element_at_top')}
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined/>}
                  >
                    {t('add_element_at_bottom')}
                  </Button>
                  <Form.ErrorList errors={errors}/>
                </Space>

              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Space align="end" style={{float: "right"}}>
            <Button type="primary" onClick={handleSave}>
              {t("save")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </>
  );
};

export default EnumView;
