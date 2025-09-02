import React, {useEffect} from "react";
import {Button, Form, Input, Modal, Select, Switch, theme} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {Index} from "@/types/data-modeling";


interface IndexFormProps {
  visible: boolean;
  datasource: string;
  model: any;
  currentValue: Index;
  onConfirm: (form: Index) => void;
  onCancel: () => void;
}

const IndexForm: React.FC<IndexFormProps> = ({
  visible,
  model,
  currentValue,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (currentValue && Object.keys(currentValue).length > 0) {
        // 编辑现有索引时，设置表单值
        form.setFieldsValue(currentValue);
      } else {
        // 添加新索引时，不清空表单，保持上次输入的内容
        // 只有当表单完全为空时才设置初始值
        const currentFormValues = form.getFieldsValue();
        if (!currentFormValues.name && (!currentFormValues.fields || currentFormValues.fields.length === 0)) {
          form.setFieldsValue({
            name: '',
            fields: [],
            unique: false,
          });
        }
      }
    }
  }, [visible, currentValue, form]);

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onConfirm(values);
      // 不清空表单，保持用户输入的内容
    });
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

  const buttonStyle = {
    fontSize: token.fontSizeSM,
  };

  const spaceStyle = {
    gap: token.marginXS,
  };

  return (
    <Modal
      title={t("index_form_title")}
      open={visible}
      onCancel={onCancel}
      onOk={handleConfirm}
      width={600}
    >
      <Form form={form} layout="vertical" style={formStyle}>
        <Form.Item name="name" label={t("name")} rules={[{ required: true }]}>
          <Input size="small" style={inputStyle} />
        </Form.Item>
        <Form.Item name="unique" label={t("unique")} valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.List
          name="fields"
          rules={[
            {
              validator: async (_, fields) => {
                if (!fields || fields.length < 1) {
                  return Promise.reject(new Error(t('index_field_size_valid')));
                }
              },
            },
          ]}
        >
          {(fields, { add, remove }, { errors }) => (
            <>
              {fields.map((field, index) => (
                <Form.Item
                  label={index === 0 ? t("fields") : ""}
                  required={false}
                  key={field.key}
                >
                  <div style={{ display: 'flex', gap: token.marginXS, alignItems: 'center' }}>
                    <Form.Item
                      {...field}
                      name={[field.name, 'fieldName']}
                      validateTrigger={["onChange", "onBlur"]}
                      noStyle
                    >
                                             <Select
                         placeholder={t("select_field")}
                         style={{ flex: 1, ...selectStyle }}
                         size="small"
                       >
                         {model?.fields
                           ?.filter((field: any) => field.type !== 'Relation')
                           ?.map((field: any) => (
                             <Select.Option key={field.name} value={field.name}>
                               {field.name}
                             </Select.Option>
                           ))}
                       </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'direction']}
                      validateTrigger={["onChange", "onBlur"]}
                      noStyle
                    >
                      <Select
                        placeholder={t("direction")}
                        style={{ width: 120, ...selectStyle }}
                        size="small"
                      >
                        <Select.Option value="ASC">ASC</Select.Option>
                        <Select.Option value="DESC">DESC</Select.Option>
                      </Select>
                    </Form.Item>
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(field.name)}
                        style={{ color: token.colorTextSecondary }}
                      />
                    ) : null}
                  </div>
                </Form.Item>
              ))}
              <Form.Item>
                <div style={spaceStyle}>
                  <Button
                    type="dashed"
                    onClick={() => add({ fieldName: '', direction: 'ASC' })}
                    icon={<PlusOutlined />}
                    size="small"
                    style={buttonStyle}
                  >
                    {t("add_field")}
                  </Button>
                  <Form.ErrorList errors={errors} />
                </div>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default IndexForm;

