import React, {useEffect, useState} from "react";
import {Button, Form, Input, message, Modal, Select} from "antd";
import {getIdentityProviders} from "@/services/identity-provider";
import {saveSettings} from "@/services/settings";
import {Settings} from "@/types/settings";
import {useConfig} from "@/store/appStore";

interface GraphQLSettingsModalProps {
  visible: boolean;
  settings: Settings | null;
  onCancel: () => void;
  onSuccess: (updatedSettings: Settings) => void;
}

const GraphQLSettingsModal: React.FC<GraphQLSettingsModalProps> = ({
  visible,
  settings,
  onCancel,
  onSuccess
}) => {
  const { config } = useConfig();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [identityProviders, setIdentityProviders] = useState<Array<{ name: string }>>([]);



  // 加载身份提供商
  useEffect(() => {
    const loadProviders = async () => {
      try {
        const providers = await getIdentityProviders();
        setIdentityProviders(providers);
      } catch (error) {
        console.error('加载身份提供商失败:', error);
      }
    };

    if (visible) {
      loadProviders();
    }
  }, [visible]);

  // 设置表单初始值
  useEffect(() => {
    if (visible && settings) {
      form.setFieldsValue({
        graphqlEndpointPath: settings.security.graphqlEndpointPath || '/graphql',
        graphqlEndpointIdentityProvider: settings.security.graphqlEndpointIdentityProvider
      });
    }
  }, [visible, settings, form]);

  // 保存配置
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (!settings) return;

      setLoading(true);
      const updatedSettings = {
        ...settings,
        security: {
          ...settings.security,
          ...values
        }
      };

      await saveSettings(updatedSettings);
      message.success('配置保存成功');
      onSuccess(updatedSettings);
    } catch (error) {
      console.error('保存配置失败:', error);
      message.error('保存配置失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置表单
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title="GraphQL 端点配置"
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="save" type="primary" loading={loading} onClick={handleSave}>
          保存配置
        </Button>
      ]}
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        className="pt-4"
      >
        <Form.Item
          name="graphqlEndpointPath"
          label="GraphQL 端点路径"
          rules={[{ required: true, message: '请输入 GraphQL 端点路径' }]}
          extra={`完整地址: ${config?.apiRootPath || ''}[端点路径]`}
        >
          <Input
            addonBefore={config?.apiRootPath || ''}
            placeholder="/graphql"
          />
        </Form.Item>

        <Form.Item
          name="graphqlEndpointIdentityProvider"
          label="身份提供商"
          extra="可选择身份提供商进行访问控制"
        >
          <Select
            options={identityProviders.map(provider => ({
              value: provider.name,
              label: provider.name
            }))}
            placeholder="选择身份提供商"
            allowClear
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default GraphQLSettingsModal;
