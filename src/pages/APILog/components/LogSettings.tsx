import {Form, InputNumber, Modal, Switch} from "antd";
import React, {useEffect, useState} from "react";
import {getSettings, saveSettings} from "../../../api/settings.ts";

interface LogSettingsProps {
  onConfirm?: (data: any) => void;
  onCancel?: () => void;
  visible: boolean;
}

const LogSettings: React.FC<LogSettingsProps> = ({visible, onConfirm, onCancel}) => {
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
    <Modal title="Logs settings" open={visible} onOk={handleSubmit} onCancel={onCancel}>
      <Form
        layout="vertical"
        form={form}
        initialValues={settings?.log}
      >
        <Form.Item
          name="maxDays"
          label="Max days retention"
        >
          <InputNumber min={1} max={30}/>
        </Form.Item>
        <Form.Item
          name="consoleLoggingEnabled"
          label="Enable console logging">
          <Switch/>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default LogSettings;
