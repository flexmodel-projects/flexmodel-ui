import React from "react";
import {Button, Collapse, List, Modal, Typography} from "antd";

export interface HistoryRecord {
  id: string;
  title: string;
  operator: string;
  time: string;
  detail: string;
  payload: Record<string, any>;
}

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  records: HistoryRecord[];
  onRestore: (record: HistoryRecord) => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({
  open,
  onClose,
  records,
  onRestore,
}) => {
  return (
    <Modal
      title="历史记录"
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <List
        itemLayout="vertical"
        dataSource={records}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            extra={
              <Button type="link" onClick={() => onRestore(item)}>
                还原此版本
              </Button>
            }
          >
            <List.Item.Meta
              title={item.title}
              description={`${item.operator} · ${item.time}`}
            />
            <Typography.Paragraph>{item.detail}</Typography.Paragraph>
            <Collapse
              size="small"
              items={[
                {
                  key: "payload",
                  label: "变更内容",
                  children: (
                    <pre
                      style={{
                        background: "#0f172a",
                        color: "#e2e8f0",
                        padding: 12,
                        borderRadius: 6,
                        maxHeight: 240,
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(item.payload, null, 2)}
                    </pre>
                  ),
                },
              ]}
            />
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default HistoryModal;

