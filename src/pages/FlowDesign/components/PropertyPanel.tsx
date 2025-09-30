import React from 'react';
import {Card, Divider, Drawer, Form, Input} from 'antd';
import {Node} from '@xyflow/react';

interface PropertyPanelProps {
  selectedNode: Node | null;
  visible: boolean;
  onClose: () => void;
  onNodePropertyChange: (nodeId: string, properties: Record<string, any>) => void;
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  visible,
  onClose,
  onNodePropertyChange,
}) => {
  const [form] = Form.useForm();
  const [propertiesText, setPropertiesText] = React.useState('');

  // 当选中节点变化时，更新表单
  React.useEffect(() => {
    if (selectedNode) {
      const properties = selectedNode.data?.properties as any || {};
      form.setFieldsValue({
        ...selectedNode.data,
        id: selectedNode.id,
        type: selectedNode.type,
        positionX: properties.positionX ?? Math.round(selectedNode.position.x),
        positionY: properties.positionY ?? Math.round(selectedNode.position.y),
        width: selectedNode.style?.width || 120,
        height: selectedNode.style?.height || 60,
        enabled: selectedNode.data?.enabled !== false, // 默认为true
      });
      // 更新properties文本
      setPropertiesText(JSON.stringify(properties, null, 2));
    } else {
      form.resetFields();
      setPropertiesText('');
    }
  }, [selectedNode, form]);

  // 处理表单值变化
  const handleFormChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      // 将坐标信息保存到properties中
      const updatedData = {
        ...selectedNode.data,
        properties: {
          ...(selectedNode.data?.properties as any || {}),
          positionX: allValues.positionX,
          positionY: allValues.positionY,
        }
      };
      onNodePropertyChange(selectedNode.id, updatedData);
    }
  };

  // 处理properties文本变化
  const handlePropertiesChange = (value: string) => {
    setPropertiesText(value);
    if (selectedNode) {
      try {
        // 尝试解析JSON
        const properties = value.trim() ? JSON.parse(value) : {};
        onNodePropertyChange(selectedNode.id, {
          ...selectedNode.data,
          properties
        });
      } catch (error) {
        // JSON格式错误时，不更新properties，但保留文本内容
        console.warn('Properties JSON格式错误:', error);
      }
    }
  };

  // 渲染节点属性配置
  const renderNodeProperties = () => {

    // 根据节点类型渲染不同的属性配置
    const renderNodeSpecificProperties = () => {
      switch (selectedNode?.type) {
        case 'startEvent':
        case 'endEvent':
          return (
            <Form.Item label="Properties (可编辑)">
              <Input.TextArea
                value={propertiesText}
                onChange={(e) => handlePropertiesChange(e.target.value)}
                rows={8}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                placeholder="请输入有效的JSON格式，例如:&#10;{&#10;  &quot;name&quot;: &quot;节点名称&quot;&#10;}"
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                提示：修改JSON格式的properties对象，格式错误时会保留文本但不更新节点数据
              </div>
            </Form.Item>
          );

        case 'userTask':
          return (
            <Form.Item label="Properties (可编辑)">
              <Input.TextArea
                value={propertiesText}
                onChange={(e) => handlePropertiesChange(e.target.value)}
                rows={8}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                placeholder="请输入有效的JSON格式，例如:&#10;{&#10;  &quot;name&quot;: &quot;节点名称&quot;&#10;}"
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                提示：修改JSON格式的properties对象，格式错误时会保留文本但不更新节点数据
              </div>
            </Form.Item>
          );

        case 'exclusiveGateway':
        case 'parallelGateway':
        case 'inclusiveGateway':
          return (
            <>
              <Form.Item label="刷新数据Key" name="hookInfoIds">
                <Input placeholder="例如: [1,2]" />
              </Form.Item>
              <Form.Item label="Properties (可编辑)">
                <Input.TextArea
                  value={propertiesText}
                  onChange={(e) => handlePropertiesChange(e.target.value)}
                  rows={8}
                  style={{
                    fontFamily: 'monospace',
                    fontSize: '12px'
                  }}
                  placeholder="请输入有效的JSON格式，例如:&#10;{&#10;  &quot;name&quot;: &quot;节点名称&quot;&#10;}"
                />
                <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  提示：修改JSON格式的properties对象，格式错误时会保留文本但不更新节点数据
                </div>
              </Form.Item>
            </>
          );

        default:
          return (
            <Form.Item label="Properties (可编辑)">
              <Input.TextArea
                value={propertiesText}
                onChange={(e) => handlePropertiesChange(e.target.value)}
                rows={8}
                style={{
                  fontFamily: 'monospace',
                  fontSize: '12px'
                }}
                placeholder="请输入有效的JSON格式，例如:&#10;{&#10;  &quot;name&quot;: &quot;节点名称&quot;&#10;}"
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                提示：修改JSON格式的properties对象，格式错误时会保留文本但不更新节点数据
              </div>
            </Form.Item>
          );
      }
    };

    return (
      <>
        <Card title="基本信息" size="small">
          <Form
            form={form}
            layout="vertical"
            size="small"
            onValuesChange={handleFormChange}
          >
            <Form.Item label="节点ID" name="id">
              <Input disabled />
            </Form.Item>
            <Form.Item label="节点名称" name="name">
              <Input placeholder="请输入节点名称" />
            </Form.Item>
            {/* X坐标和Y坐标字段隐藏，只保存在properties中 */}
            <Form.Item name="positionX" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
            <Form.Item name="positionY" style={{ display: 'none' }}>
              <Input />
            </Form.Item>
          </Form>
        </Card>
        <Divider style={{margin: '16px 0'}} />
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
      </>
    );
  };

  return (
    <Drawer
      title={form.getFieldValue('name')}
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
      </div>
    </Drawer>
  );
};

export default PropertyPanel;
