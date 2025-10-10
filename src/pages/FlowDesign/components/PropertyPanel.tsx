import React from 'react';
import {Button, Card, Divider, Drawer, Form, Input, InputNumber, Popover, Radio, Space, Typography} from 'antd';
import {Edge, Node} from '@xyflow/react';
import ScriptEditor from '../../../components/common/ScriptEditor';
import {CodeOutlined} from '@ant-design/icons';

interface CustomEdge extends Edge {
  type: 'arrow';
  sourceHandle: string | null;
  targetHandle: string | null;
  data: {
    conditionsequenceflow: string;
    defaultConditions: string;
    onDelete: (edgeId: string) => void;
    onInsert?: (edgeId: string, nodeType: string) => void;
  };
}

interface PropertyPanelProps {
  selectedNode: Node | null;
  selectedEdge: CustomEdge | null;
  visible: boolean;
  onClose: () => void;
  onNodePropertyChange: (nodeId: string, properties: Record<string, any>) => void;
  onEdgePropertyChange: (edgeId: string, data: Record<string, any>) => void;
  nodes: Node[];
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  selectedNode,
  selectedEdge,
  visible,
  onClose,
  onNodePropertyChange,
  onEdgePropertyChange,
  nodes,
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
        // 设置嵌套的 properties 字段
        properties: baseProperties,
      });
      // 更新本地属性状态
      setNodeProperties(properties);
    } else if (selectedEdge) {
      // 当选中边时，更新表单
      form.setFieldsValue({
        edgeId: selectedEdge.id,
        sourceNode: selectedEdge.source,
        targetNode: selectedEdge.target,
        conditionsequenceflow: selectedEdge.data?.conditionsequenceflow || '',
        defaultConditions: selectedEdge.data?.defaultConditions || 'false',
      });
    } else {
      form.resetFields();
      setNodeProperties({});
    }
  }, [selectedNode, selectedEdge, form]);

  // 处理表单值变化
  const handleFormChange = (_changedValues: any, allValues: any) => {
    if (selectedNode) {
      // 合并所有属性，包括嵌套的 properties 字段
      const nextProps = {
        ...(selectedNode.data?.properties as any || {}),
        ...(allValues.properties || {}), // 合并嵌套的 properties 字段
        name: allValues.name,
        positionX: allValues.positionX,
        positionY: allValues.positionY,
      } as any;
      setNodeProperties(nextProps);

      // 传递统一格式的数据给父组件
      onNodePropertyChange(selectedNode.id, {
        name: allValues.name,
        positionX: allValues.positionX,
        positionY: allValues.positionY,
        properties: nextProps
      });
    } else if (selectedEdge) {
      // 处理边属性变化
      onEdgePropertyChange(selectedEdge.id, {
        conditionsequenceflow: allValues.conditionsequenceflow || '',
        defaultConditions: allValues.defaultConditions || 'false',
      });
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

        // 传递统一格式的数据给父组件
        onNodePropertyChange(selectedNode.id, {
          name: nextName,
          positionX: nextPositionX,
          positionY: nextPositionY,
          properties: updatedProps
        });
      } catch (error) {
        // JSON格式错误时，不更新properties，但保留文本内容
        console.warn('Properties JSON格式错误:', error);
      }
    }
  };

  // 渲染服务任务节点属性配置
  const renderServiceTaskProperties = () => {
    const subType = (selectedNode?.data?.properties as any)?.subType;

    switch (subType) {
      case 'js':
        return (
          <>
            <Form.Item label="脚本类型">
              <Input value="JavaScript" disabled />
            </Form.Item>
            <Form.Item label="脚本内容" name={['properties', 'script']}>
              <ScriptEditor
                language="javascript"
              />
            </Form.Item>
          </>
        );

      case 'groovy':
        return (
          <>
            <Form.Item label="脚本类型">
              <Input value="Groovy" disabled />
            </Form.Item>
            <Form.Item label="脚本内容" name={['properties', 'script']}>
              <ScriptEditor
                language="groovy"
              />
            </Form.Item>
          </>
        );

      case 'add-record':
        return (
          <>
            <Form.Item label="数据源" name={['properties', 'dataSource']}>
              <Input placeholder="请选择数据源" />
            </Form.Item>
            <Form.Item label="表名" name={['properties', 'tableName']}>
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item label="字段映射" name={['properties', 'fieldMapping']}>
              <Input.TextArea placeholder="请输入字段映射配置" rows={4} />
            </Form.Item>
          </>
        );

      case 'update-record':
        return (
          <>
            <Form.Item label="数据源" name={['properties', 'dataSource']}>
              <Input placeholder="请选择数据源" />
            </Form.Item>
            <Form.Item label="表名" name={['properties', 'tableName']}>
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item label="更新条件" name={['properties', 'updateCondition']}>
              <Input placeholder="请输入更新条件" />
            </Form.Item>
            <Form.Item label="更新字段" name={['properties', 'updateFields']}>
              <Input.TextArea placeholder="请输入更新字段配置" rows={4} />
            </Form.Item>
          </>
        );

      case 'query-record':
        return (
          <>
            <Form.Item label="数据源" name={['properties', 'dataSource']}>
              <Input placeholder="请选择数据源" />
            </Form.Item>
            <Form.Item label="表名" name={['properties', 'tableName']}>
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item label="查询条件" name={['properties', 'queryCondition']}>
              <Input placeholder="请输入查询条件" />
            </Form.Item>
            <Form.Item label="返回字段" name={['properties', 'returnFields']}>
              <Input placeholder="请输入返回字段，用逗号分隔" />
            </Form.Item>
            <Form.Item label="排序字段" name={['properties', 'orderBy']}>
              <Input placeholder="请输入排序字段" />
            </Form.Item>
            <Form.Item label="限制条数" name={['properties', 'limit']}>
              <InputNumber placeholder="请输入限制条数" min={1} />
            </Form.Item>
          </>
        );

      case 'delete-record':
        return (
          <>
            <Form.Item label="数据源" name={['properties', 'dataSource']}>
              <Input placeholder="请选择数据源" />
            </Form.Item>
            <Form.Item label="表名" name={['properties', 'tableName']}>
              <Input placeholder="请输入表名" />
            </Form.Item>
            <Form.Item label="删除条件" name={['properties', 'deleteCondition']}>
              <Input placeholder="请输入删除条件" />
            </Form.Item>
          </>
        );

      default:
        return (
          <></>
        );
    }
  };

  // 获取节点名称
  const getNodeName = (nodeId: string): string => {
    const node = nodes.find(n => n.id === nodeId);
    return (node?.data?.name as string) || nodeId;
  };

  // 检查源节点是否为网关节点
  const isSourceNodeGateway = () => {
    if (!selectedEdge) return false;
    const sourceNode = nodes.find(n => n.id === selectedEdge.source);
    if (!sourceNode) return false;
    return ['exclusiveGateway', 'parallelGateway', 'inclusiveGateway'].includes(sourceNode.type || '');
  };

  // 渲染边属性配置
  const renderEdgeProperties = () => {
    if (!selectedEdge) return null;

    const isGateway = isSourceNodeGateway();

    return (
      <>
        <Card title="连线信息" size="small">
          <Form
            form={form}
            layout="vertical"
            size="small"
            onValuesChange={handleFormChange}
          >
            <Form.Item label="连线ID" name="edgeId">
              <Input disabled />
            </Form.Item>
            <Form.Item label="源节点" name="sourceNode">
              <Input
                disabled
                suffix={<span style={{ color: '#999', fontSize: '12px' }}>({getNodeName(selectedEdge.source)})</span>}
              />
            </Form.Item>
            <Form.Item label="目标节点" name="targetNode">
              <Input
                disabled
                suffix={<span style={{ color: '#999', fontSize: '12px' }}>({getNodeName(selectedEdge.target)})</span>}
              />
            </Form.Item>
          </Form>
        </Card>
        <Divider style={{ margin: '16px 0' }} />
        <Card title="连线条件" size="small">
          <Form
            form={form}
            layout="vertical"
            size="small"
            onValuesChange={handleFormChange}
          >
            {isGateway && (
              <>
                <Form.Item
                  label="条件表达式"
                  name="conditionsequenceflow"
                  tooltip="条件表达式，例如：${score > 60}，用于判断是否执行该路径"
                >
                  <Input.TextArea
                    placeholder="请输入条件表达式，例如：${score > 60}"
                    rows={4}
                    style={{
                      fontFamily: 'Consolas, Monaco, "Courier New", monospace',
                      fontSize: '13px'
                    }}
                  />
                </Form.Item>
                <Form.Item
                  label="默认路径"
                  name="defaultConditions"
                  tooltip="是否为默认路径，当所有条件都不满足时执行默认路径"
                >
                  <Radio.Group>
                    <Radio value="true">是</Radio>
                    <Radio value="false">否</Radio>
                  </Radio.Group>
                </Form.Item>
                <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                  <p><strong>条件表达式说明：</strong></p>
                  <ul style={{ paddingLeft: '20px', marginTop: '4px' }}>
                    <li>使用 ${'{'}expression{'}'} 格式编写条件</li>
                    <li>可以访问流程变量，如：${'{'} score {'>'} 60 {'}'}</li>
                    <li>支持比较运算符：{'>'}、{'<'}、==、!=、{'>'}=、{'<'}=</li>
                    <li>支持逻辑运算符：&&（与）、||（或）、!（非）</li>
                    <li>默认路径无需设置条件表达式</li>
                  </ul>
                </div>
              </>
            )}
            {!isGateway && (
              <div style={{ color: '#999', padding: '16px', textAlign: 'center' }}>
                普通连线无需设置条件
              </div>
            )}
          </Form>
        </Card>
      </>
    );
  };

  // 渲染节点属性配置
  const renderNodeProperties = () => {

    // 根据节点类型渲染不同的属性配置
    const renderNodeSpecificProperties = () => {
      switch (selectedNode?.type) {
        case 'startEvent':
        case 'endEvent':
          return (
            <></>
          );

        case 'userTask':
          return (
            <></>
          );

        case 'serviceTask':
          return renderServiceTaskProperties();

        case 'exclusiveGateway':
        case 'parallelGateway':
        case 'inclusiveGateway':
          return (
            <>
              <Form.Item label="刷新数据Key" name="hookInfoIds">
                <Input placeholder="例如: [1,2]" />
              </Form.Item>
            </>
          );

        default:
          return (
            <></>
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
        <Divider style={{ margin: '16px 0' }} />
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
      title={selectedEdge ? '连线属性' : form.getFieldValue('name')}
      extra={
        <Space align="center">
          <Popover
            content={
              <div>
                <Typography.Paragraph
                  copyable
                  style={{ whiteSpace: "pre-wrap", margin: "8px 0 0 0" }}
                >
                  {JSON.stringify(nodeProperties, null, 2)}
                </Typography.Paragraph>
              </div>
            }
            title="连线属性"
          >
            <Button icon={<CodeOutlined />} type="text" size="small" />
          </Popover>
        </Space>
      }
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
        {selectedEdge ? renderEdgeProperties() : renderNodeProperties()}
      </div>
    </Drawer>
  );
};

export default PropertyPanel;
