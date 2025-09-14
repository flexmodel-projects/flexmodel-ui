import React from 'react';
import {Card, Checkbox, Divider, Drawer, Form, Input, InputNumber, Radio, Space, Switch, Typography} from 'antd';
import {Node} from '@xyflow/react';
import {FlowStatus} from '../types/flow.d';

const { Text } = Typography;

interface PropertyPanelProps {
  selectedNode: Node | null;
  flowName: string;
  flowTitle: string;
  flowStatus: FlowStatus;
  visible: boolean;
  onClose: () => void;
  onFlowNameChange: (name: string) => void;
  onFlowTitleChange: (title: string) => void;
  onFlowStatusChange: (status: FlowStatus) => void;
  onNodePropertyChange: (nodeId: string, properties: Record<string, any>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  flowName,
  flowTitle,
  flowStatus,
  visible,
  onClose,
  onFlowNameChange,
  onFlowTitleChange,
  onFlowStatusChange,
  onNodePropertyChange,
}) => {
  const [form] = Form.useForm();

  // 当选中节点变化时，更新表单
  React.useEffect(() => {
    if (selectedNode) {
      form.setFieldsValue({
        ...selectedNode.data,
        id: selectedNode.id,
        type: selectedNode.type,
        positionX: Math.round(selectedNode.position.x),
        positionY: Math.round(selectedNode.position.y),
        width: selectedNode.style?.width || 120,
        height: selectedNode.style?.height || 60,
        enabled: selectedNode.data?.enabled !== false, // 默认为true
      });
    } else {
      form.resetFields();
    }
  }, [selectedNode, form]);

  // 处理表单值变化
  const handleFormChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      onNodePropertyChange(selectedNode.id, allValues);
    }
  };

  // 渲染节点属性配置
  const renderNodeProperties = () => {
    if (!selectedNode) {
      return (
        <Card title="流程属性" size="small">
          <Form layout="vertical" size="small">
            <Form.Item label="*流程名称">
              <Input
                value={flowName}
                onChange={(e) => onFlowNameChange(e.target.value)}
                placeholder="请输入流程名称"
                maxLength={50}
                showCount
              />
            </Form.Item>

            <Form.Item label="流程标题">
              <Input
                value={flowTitle}
                onChange={(e) => onFlowTitleChange(e.target.value)}
                placeholder="请输入流程标题"
                suffix={<Text type="secondary">f(x)</Text>}
              />
            </Form.Item>

            <Form.Item label="流程状态">
              <Radio.Group
                value={flowStatus}
                onChange={(e) => onFlowStatusChange(e.target.value)}
              >
                <Radio value="enabled">启用</Radio>
                <Radio value="disabled">停用</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="消息通知方式">
              <Space direction="vertical">
                <Checkbox defaultChecked>站内消息</Checkbox>
                <Checkbox>邮件通知</Checkbox>
                <Checkbox>钉钉通知</Checkbox>
              </Space>
            </Form.Item>

            <Form.Item label="节点超期">
              <Switch />
            </Form.Item>
          </Form>
        </Card>
      );
    }

    // 根据节点类型渲染不同的属性配置
    const renderNodeSpecificProperties = () => {
      switch (selectedNode.type) {
        case 'startEvent':
        case 'endEvent':
          return (
            <Form.Item label="节点名称" name="name">
              <Input placeholder="请输入节点名称" />
            </Form.Item>
          );

        case 'userTask':
          return (
            <>
              <Form.Item label="节点名称" name="name">
                <Input placeholder="请输入节点名称" />
              </Form.Item>
            </>
          );

        case 'exclusiveGateway':
        case 'parallelGateway':
        case 'inclusiveGateway':
          return (
            <>
              <Form.Item label="节点名称" name="name">
                <Input placeholder="请输入节点名称" />
              </Form.Item>
              <Form.Item label="刷新数据Key" name="hookInfoIds">
                <Input placeholder="例如: [1,2]" />
              </Form.Item>
            </>
          );

        default:
          return (
            <Form.Item label="节点名称" name="name">
              <Input placeholder="请输入节点名称" />
            </Form.Item>
          );
      }
    };

    return (
      <Card title="节点属性" size="small">
        <Form
          form={form}
          layout="vertical"
          size="small"
          onValuesChange={handleFormChange}
        >
          {renderNodeSpecificProperties()}
        </Form>
      </Card>
    );
  };

  return (
    <Drawer
      title="属性配置面板"
      placement="right"
      width={400}
      open={visible}
      onClose={onClose}
      destroyOnClose={false}
      mask={false}
      style={{ position: 'absolute' }}
      getContainer={false}
    >
      <div style={{ height: '100%', overflow: 'auto' }}>
        {renderNodeProperties()}

        {selectedNode && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <Card title="节点信息" size="small">
              <Form
                form={form}
                layout="vertical"
                size="small"
                onValuesChange={handleFormChange}
              >
                <Form.Item label="节点ID" name="id">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="节点类型" name="type">
                  <Input disabled />
                </Form.Item>

                <Form.Item label="X坐标" name="positionX">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="X坐标"
                    onChange={(value) => {
                      if (selectedNode && value !== null) {
                        onNodePropertyChange(selectedNode.id, {
                          ...selectedNode.data,
                          positionX: value
                        });
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item label="Y坐标" name="positionY">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="Y坐标"
                    onChange={(value) => {
                      if (selectedNode && value !== null) {
                        onNodePropertyChange(selectedNode.id, {
                          ...selectedNode.data,
                          positionY: value
                        });
                      }
                    }}
                  />
                </Form.Item>

                <Form.Item label="节点宽度" name="width">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="节点宽度"
                    min={50}
                    max={500}
                  />
                </Form.Item>

                <Form.Item label="节点高度" name="height">
                  <InputNumber
                    style={{ width: '100%' }}
                    placeholder="节点高度"
                    min={30}
                    max={300}
                  />
                </Form.Item>

                <Form.Item label="节点描述" name="description">
                  <Input.TextArea
                    placeholder="节点描述信息"
                    rows={3}
                    maxLength={200}
                    showCount
                  />
                </Form.Item>

                <Form.Item label="是否启用" name="enabled" valuePropName="checked">
                  <Switch />
                </Form.Item>
              </Form>
            </Card>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default PropertyPanel;
