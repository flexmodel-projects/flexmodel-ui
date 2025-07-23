import {Form, InputNumber, Modal, Switch} from "antd";
import React, {useEffect, useState} from "react";
import {getSettings, saveSettings} from "../../../services/settings.ts";
import {useTranslation} from "react-i18next";

interface LogSettingsProps {
  onConfirm?: (data: any) => void;
  onCancel?: () => void;
  visible: boolean;
}

const LogSettings: React.FC<LogSettingsProps> = ({visible, onConfirm, onCancel}) => {
  const {t} = useTranslation();
  const [settings, setSettings] = useState<any>();

  useEffect(() => {
    getSettings().then(res => {
      setSettings(res);
    });
  }, []);

  const [form] = Form.useForm();

  const handleSubmit = async () => {
    const values = await form.validateFields();
    const newSettings = {...settings, log: values};
    await saveSettings(newSettings);
    setSettings(newSettings);
    if (onConfirm) {
      onConfirm(values);
    }
  }

  return (
    <Modal title={t('logs_settings')} open={visible} onOk={handleSubmit} onCancel={onCancel}>
      <Form
        layout="vertical"
        form={form}
        initialValues={settings?.log}
      >
        <Form.Item
          name="maxDays"
          label={t('logs_max_days_retention')}
        >
          <InputNumber min={1} max={30}/>
        </Form.Item>
        <Form.Item
          name="consoleLoggingEnabled"
          label={t('logs_enable_console_Logging')}>
          <Switch/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default LogSettings;
