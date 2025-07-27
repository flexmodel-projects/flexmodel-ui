import React, {useEffect} from "react";
import {Button, Form, Input, Modal, Select, Switch, theme} from "antd";
import {MinusCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {Index} from "@/types/data-modeling";
import {getCompactFormStyle} from '@/utils/theme';

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
      if (currentValue) {
        form.setFieldsValue(currentValue);
      } else {
        form.setFieldsValue({
          name: '',
          fields: [],
          unique: false,
        });
      }
    }
  }, [visible, currentValue]);

  const handleConfirm = () => {
    form.validateFields().then((values) => {
      onConfirm(values);
    });
  };

  // 紧凑主题样式
  const formStyle = {
    ...getCompactFormStyle(token),
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
                  <Form.Item
                    {...field}
                    validateTrigger={["onChange", "onBlur"]}
                    noStyle
                  >
                    <div style={{ display: 'flex', gap: token.marginXS, alignItems: 'center' }}>
                                              <Select
                          placeholder={t("select_field")}
                          style={{ flex: 1, ...selectStyle }}
                          size="small"
                        >
                        {model?.fields?.map((field: any) => (
                          <Select.Option key={field.name} value={field.name}>
                            {field.name}
                          </Select.Option>
                        ))}
                      </Select>
                      <Select
                        placeholder={t("direction")}
                        style={{ width: 120, ...selectStyle }}
                        size="small"
                      >
                        <Select.Option value="ASC">ASC</Select.Option>
                        <Select.Option value="DESC">DESC</Select.Option>
                      </Select>
                      {fields.length > 1 ? (
                        <MinusCircleOutlined
                          className="dynamic-delete-button"
                          onClick={() => remove(field.name)}
                          style={{ color: token.colorTextSecondary }}
                        />
                      ) : null}
                    </div>
                  </Form.Item>
                </Form.Item>
              ))}
              <Form.Item>
                <div style={spaceStyle}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
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
