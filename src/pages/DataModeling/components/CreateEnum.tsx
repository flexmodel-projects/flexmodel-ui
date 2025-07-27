import React from 'react';
import {Button, Drawer, Form, Input, notification, Space, theme} from 'antd';
import {MinusCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {createModel} from '../../../services/model.ts';
import {useTranslation} from 'react-i18next';


interface CreateEnumProps {
  visible: boolean;
  datasource: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CreateEnum: React.FC<CreateEnumProps> = ({
  visible,
  datasource,
  onConfirm,
  onCancel,
}) => {
  const {t} = useTranslation();
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const enumData = {
        ...values,
        type: 'ENUM',
      };
      await createModel(datasource, enumData);
      notification.success({message: t('form_save_success')});
      onConfirm();
    } catch (error) {
      console.error(error);
      notification.error({message: t('form_save_failed')});
    }
  };

  // 紧凑主题样式
  const formStyle = {
    
  };

  const buttonStyle = {
    fontSize: token.fontSizeSM,
  };

  const spaceStyle = {
    gap: token.marginXS,
  };

  return (
    <Drawer
      title={t('new_enum')}
      open={visible}
      onClose={onCancel}
      width={600}
      footer={
        <div style={{textAlign: 'right'}}>
          <Button onClick={onCancel} style={{marginRight: 8}}>
            {t('cancel')}
          </Button>
          <Button onClick={handleSubmit} type="primary">
            {t('confirm')}
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical" style={formStyle}>
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
    </Drawer>
  );
};

export default CreateEnum;

