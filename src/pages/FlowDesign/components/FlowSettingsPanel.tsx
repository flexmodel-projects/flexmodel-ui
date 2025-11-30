import React from 'react';
import {Drawer, Form, Input} from 'antd';

interface FlowSettingsPanelProps {
  visible: boolean;
  onClose: () => void;
  flowName: string;
  flowKey: string;
  flowRemark: string;
  onFlowNameChange: (name: string) => void;
  onFlowKeyChange: (key: string) => void;
  onFlowRemarkChange: (remark: string) => void;
}

const FlowSettingsPanel: React.FC<FlowSettingsPanelProps> = ({
  visible,
  onClose,
  flowName,
  flowKey,
  flowRemark,
  onFlowNameChange,
  onFlowKeyChange,
  onFlowRemarkChange,
}) => {
  return (
    <Drawer
      title="流程设置"
      placement="right"
      size={400}
      open={visible}
      onClose={onClose}
      destroyOnHidden={false}
      style={{ position: 'absolute' }}
      getContainer={false}
    >
      <Form layout="vertical" size="small">
        <Form.Item label="流程名称" required>
          <Input
            value={flowName}
            onChange={(e) => onFlowNameChange(e.target.value)}
            placeholder="请输入流程名称"
            maxLength={50}
            showCount
          />
        </Form.Item>

        <Form.Item label="流程键">
          <Input
            value={flowKey}
            onChange={(e) => onFlowKeyChange(e.target.value)}
            placeholder="请输入流程键"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item label="备注">
          <Input.TextArea
            value={flowRemark}
            onChange={(e) => onFlowRemarkChange(e.target.value)}
            placeholder="请输入流程备注"
            rows={4}
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FlowSettingsPanel;
