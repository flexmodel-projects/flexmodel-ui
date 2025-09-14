import React, {useState} from 'react';
import {Card, Col, Collapse, Row, Space, Typography} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  FileAddOutlined,
  InfoCircleOutlined,
  LinkOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {NodePanelItem, NodeType} from '../types/flow.d';

const { Panel } = Collapse;
const { Text } = Typography;

const NodePanel: React.FC = () => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);

  // 节点配置
  const nodeConfigs: NodePanelItem[] = [
    // 人工节点
    { type: 'userTask', label: '人工任务', icon: 'user-check', category: 'activities' },

    // 自动节点
    { type: 'serviceTask', label: '新增记录', icon: 'add-record', category: 'serviceTasks' },
    { type: 'serviceTask', label: '更新记录', icon: 'update-record', category: 'serviceTasks' },
    { type: 'serviceTask', label: '查询记录', icon: 'query-record', category: 'serviceTasks' },
    { type: 'serviceTask', label: '删除记录', icon: 'delete-record', category: 'serviceTasks' },
    { type: 'serviceTask', label: '延时节点', icon: 'delay', category: 'serviceTasks' },

    // 网关节点
    { type: 'exclusiveGateway', label: '排他网关', icon: 'gateway-exclusive', category: 'gateways' },
    { type: 'parallelGateway', label: '并行网关', icon: 'gateway-parallel', category: 'gateways' },
    { type: 'inclusiveGateway', label: '包容网关', icon: 'gateway-inclusive', category: 'gateways' },


    // 高级
    { type: 'callActivity', label: '子流程', icon: 'call-service', category: 'advanced' },
  ];

  // 获取图标组件
  const getIcon = (iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'user-check': <CheckCircleOutlined style={{ color: '#1890ff' }} />,
      'user-info': <InfoCircleOutlined style={{ color: '#52c41a' }} />,
      'user-edit': <EditOutlined style={{ color: '#faad14' }} />,
      'gateway-exclusive': <CloseCircleOutlined style={{ color: '#ff4d4f' }} />,
      'gateway-parallel': <PlusCircleOutlined style={{ color: '#ff4d4f' }} />,
      'gateway-inclusive': <MinusCircleOutlined style={{ color: '#ff4d4f' }} />,
      'submit': <FileAddOutlined style={{ color: '#722ed1' }} />,
      'add-record': <SettingOutlined style={{ color: '#52c41a' }} />,
      'update-record': <SettingOutlined style={{ color: '#52c41a' }} />,
      'query-record': <SettingOutlined style={{ color: '#52c41a' }} />,
      'delete-record': <SettingOutlined style={{ color: '#52c41a' }} />,
      'delay': <SettingOutlined style={{ color: '#52c41a' }} />,
      'call-service': <LinkOutlined style={{ color: '#722ed1' }} />,
    };
    return iconMap[iconType] || <UserOutlined />;
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType) => {
    setDraggedNode(nodeType);
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('application/reactflow', nodeType);
  };

  // 处理拖拽结束
  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  // 按分类组织节点
  const categorizedNodes = nodeConfigs.reduce((acc, node) => {
    if (!acc[node.category]) {
      acc[node.category] = [];
    }
    acc[node.category].push(node);
    return acc;
  }, {} as Record<string, NodePanelItem[]>);

  // 获取分类标题
  const getCategoryTitle = (category: string) => {
    const titles: Record<string, string> = {
      events: '开始事件',
      activities: '人工节点',
      serviceTasks: '自动节点',
      gateways: '网关节点',
      advanced: '高级',
    };
    return titles[category] || category;
  };

  return (
    <Card title="节点选择面板" style={{ height: '100%' }}>
      <Collapse defaultActiveKey={['activities', 'gateways', 'serviceTasks', 'advanced']} ghost>
        {Object.entries(categorizedNodes).map(([category, nodes]) => (
          <Panel
            header={getCategoryTitle(category)}
            key={category}
            style={{ marginBottom: 8 }}
          >
            <Row gutter={[8, 8]}>
              {nodes.map((node, index) => (
                <Col span={12} key={`${node.type}-${index}`}>
                  <Card
                    size="small"
                    hoverable
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type)}
                    onDragEnd={handleDragEnd}
                    style={{
                      opacity: draggedNode === node.type ? 0.5 : 1,
                    }}
                  >
                    <Space>
                      {getIcon(node.icon)}
                      <Text style={{ fontSize: '12px' }}>{node.label}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Panel>
        ))}
      </Collapse>
    </Card>
  );
};

export default NodePanel;
