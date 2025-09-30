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
  const [nodeProperties, setNodeProperties] = React.useState<Record<string, any>>({});

  // 当选中节点变化时，更新表单
  React.useEffect(() => {
    if (selectedNode) {
      const baseProperties = (selectedNode.data?.properties as any) || {};
      // 首次进入时若没有properties，回填常用字段
      const properties = {
        name: selectedNode.data?.name,
        positionX: Math.round(selectedNode.position.x),
        positionY: Math.round(selectedNode.position.y),
        ...baseProperties,
      } as any;
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
      // 更新本地属性状态
      setNodeProperties(properties);
    } else {
      form.resetFields();
      setNodeProperties({});
    }
  }, [selectedNode, form]);

  // 处理表单值变化
  const handleFormChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      // 同步基础字段到data，并把名称与坐标写入properties
      const updatedData = {
        ...selectedNode.data,
        name: allValues.name,
        properties: {
          ...(selectedNode.data?.properties as any || {}),
          name: allValues.name,
          positionX: allValues.positionX,
          positionY: allValues.positionY,
        }
      };
      // 实时同步本地属性
      const nextProps = {
        ...(selectedNode.data?.properties as any || {}),
        name: allValues.name,
        positionX: allValues.positionX,
        positionY: allValues.positionY,
      } as any;
      setNodeProperties(nextProps);
      onNodePropertyChange(selectedNode.id, updatedData);
    }
  };

  // 处理properties文本变化
  const handlePropertiesChange = (value: string) => {
    if (selectedNode) {
      try {
        // 尝试解析JSON
        const properties = value.trim() ? JSON.parse(value) : {};

        // 将 properties 中的关键字段同步到表单
        const nextName = properties.name !== undefined ? properties.name : form.getFieldValue('name');
        const nextPositionX = properties.positionX !== undefined ? properties.positionX : form.getFieldValue('positionX');
        const nextPositionY = properties.positionY !== undefined ? properties.positionY : form.getFieldValue('positionY');

        form.setFieldsValue({
          name: nextName,
          positionX: nextPositionX,
          positionY: nextPositionY,
        });

        // 同步到节点数据（顶层与 properties 中都写入），并更新本地属性状态
        const updatedProps = {
          ...(selectedNode.data?.properties as any || {}),
          ...properties,
          name: nextName,
          positionX: nextPositionX,
          positionY: nextPositionY,
        };
        setNodeProperties(updatedProps);
        onNodePropertyChange(selectedNode.id, {
          ...selectedNode.data,
          name: nextName,
          positionX: nextPositionX,
          positionY: nextPositionY,
          properties: {
            ...(selectedNode.data?.properties as any || {}),
            ...properties,
            name: nextName,
            positionX: nextPositionX,
            positionY: nextPositionY,
          }
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
                value={JSON.stringify(nodeProperties, null, 2)}
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
                value={JSON.stringify(nodeProperties, null, 2)}
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
                  value={JSON.stringify(nodeProperties, null, 2)}
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
                value={JSON.stringify(nodeProperties, null, 2)}
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
