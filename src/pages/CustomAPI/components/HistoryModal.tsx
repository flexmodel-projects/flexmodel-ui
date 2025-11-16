import React from "react";
import {Button, Collapse, List, Modal, Typography} from "antd";
import Editor from "@monaco-editor/react";
import {useTheme} from "@/store/appStore";

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
  const {isDark} = useTheme();
  return (
    <Modal
      title="历史记录"
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <div style={{
        top: 20,
        overflow: "auto",
        height: "calc(100vh - 240px)",
      }}>
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
                      <div style={{overflow: "hidden", borderRadius: 6}}>
                        <Editor
                          height={240}
                          defaultLanguage="json"
                          language="json"
                          theme={isDark ? "vs-dark" : "vs"}
                          value={JSON.stringify(item.payload ?? {}, null, 2)}
                          options={{
                            readOnly: true,
                            fontSize: 12,
                            minimap: {enabled: false},
                            lineNumbers: "on",
                            glyphMargin: false,
                            lineDecorationsWidth: 0,
                            scrollBeyondLastLine: false,
                            wordWrap: "on",
                            folding: true,
                            renderWhitespace: "none",
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    ),
                  },
                ]}
              />
            </List.Item>
          )}
        />
      </div>

    </Modal>
  );
};

export default HistoryModal;

