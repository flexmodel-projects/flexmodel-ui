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
  PlayCircleOutlined,
  PlusCircleOutlined,
  SettingOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {NodePanelItem, NodeType} from '../types/flow.d';
import {categoryTitle, nodeCatalog} from '../components/nodes/catalog';

const { Panel } = Collapse;
const { Text } = Typography;

const NodePanel: React.FC = () => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);

  // 节点配置（与加号菜单共用）
  const nodeConfigs: NodePanelItem[] = nodeCatalog;

  // 获取图标组件
  const getIcon = (iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'start-event': <PlayCircleOutlined style={{ color: '#52c41a' }} />,
      'end-event': <StopOutlined style={{ color: '#ff4d4f' }} />,
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
  const getCategoryTitle = (category: string) => (categoryTitle as Record<string, string>)[category] || category;

  return (
    <Card title="节点选择面板" style={{ height: '100%' }}>
      <Collapse defaultActiveKey={['events', 'activities', 'gateways', 'serviceTasks', 'advanced']} ghost>
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
