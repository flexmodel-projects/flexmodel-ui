import React, {useEffect} from "react";
import {Button, Form, Input, Space, theme} from "antd";
import {useTranslation} from "react-i18next";
import type {Enum} from "@/types/data-modeling";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";


interface EnumViewProps {
  datasource: string;
  model?: Partial<Enum>;
  onConfirm: (model: Enum) => void;
}

const EnumView: React.FC<EnumViewProps> = ({model, onConfirm}) => {
  const {t} = useTranslation();
  const { token } = theme.useToken();

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

  // 紧凑主题样式
  const containerStyle = {
    
    padding: token.paddingSM,
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    border: ` ${token.colorBorder}`,
  };

  const formStyle = {
    
  };

  const inputStyle = {
    width: '60%',
    fontSize: token.fontSizeSM,
  };

  const buttonStyle = {
    fontSize: token.fontSizeSM,
  };

  const spaceStyle = {
    gap: token.marginXS,
  };

  return (
    <div style={containerStyle}>
      <Form form={form} initialValues={model} layout="vertical" style={formStyle}>
        <Form.Item name="name" label={t("name")} rules={[{required: true}]}>
          <Input disabled={!!model} size="small"/>
        </Form.Item>
        <Form.Item name="comment" label={t("comment")} rules={[{required: true}]}>
          <Input size="small"/>
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
                    <Input style={inputStyle} size="small"/>
                  </Form.Item>
                  {fields.length > 1 ? (
                    <MinusCircleOutlined
                      className="dynamic-delete-button"
                      onClick={() => remove(field.name)}
                      style={{ marginLeft: token.marginXS, color: token.colorTextSecondary }}
                    />
                  ) : null}
                </Form.Item>
              ))}
              <Form.Item>
                <Space style={spaceStyle}>
                  <Button
                    type="dashed"
                    onClick={() => {
                      add('', 0);
                    }}
                    icon={<PlusOutlined/>}
                    size="small"
                    style={buttonStyle}
                  >
                    {t('add_element_at_top')}
                  </Button>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined/>}
                    size="small"
                    style={buttonStyle}
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
          <Space align="end" style={{float: "right", gap: token.marginXS}}>
            <Button type="primary" onClick={handleSave} size="small">
              {t("save")}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default EnumView;

