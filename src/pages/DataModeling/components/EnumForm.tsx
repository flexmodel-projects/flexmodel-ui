import React from 'react';
import {Button, Form, Input, Space, theme} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {useTranslation} from 'react-i18next';

interface EnumFormProps {
  form: any;
}

const EnumForm: React.FC<EnumFormProps> = ({ form }) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();

  const buttonStyle = {
    fontSize: token.fontSizeSM,
  };

  const spaceStyle = {
    gap: token.marginXS,
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Form form={form} layout="vertical">
        <Form.Item name="name" label={t('name')} rules={[{required: true}]}>
          <Input size="small"/>
        </Form.Item>
        <Form.Item name="comment" label={t('comment')} rules={[{required: true}]}>
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
                    <Input style={{width: '60%'}} size="small"/>
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
      </Form>
    </div>
  );
};

export default EnumForm;
