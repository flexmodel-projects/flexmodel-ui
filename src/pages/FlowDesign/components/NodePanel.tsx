import React, {useState} from 'react';
import {Button, Card, Col, Collapse, Row, Space, Typography} from 'antd';
import {
  ApiOutlined,
  CloseCircleOutlined,
  CodeOutlined,
  DatabaseOutlined,
  EditOutlined,
  FileAddOutlined,
  LinkOutlined,
  MenuFoldOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
  StopOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {NodePanelItem, NodeType} from '../types/flow.d';
import {categoryTitle, nodeCatalog} from '../components/nodes/catalog';

const {Panel} = Collapse;
const {Text} = Typography;

type NodePanelProps = {
  onHide?: () => void;
};

const NodePanel: React.FC<NodePanelProps> = ({onHide}) => {
  const [draggedNode, setDraggedNode] = useState<NodeType | null>(null);

  // 节点配置（与加号菜单共用）
  const nodeConfigs: NodePanelItem[] = nodeCatalog;

  // 获取图标组件
  const getIcon = (iconType: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'start-event': <PlayCircleOutlined style={{color: '#52c41a'}}/>,
      'end-event': <StopOutlined style={{color: '#ff4d4f'}}/>,
      'user-task': <UserOutlined style={{color: '#1890ff'}}/>,
      'gateway-exclusive': <CloseCircleOutlined style={{color: '#ff4d4f'}}/>,
      'gateway-parallel': <PlusCircleOutlined style={{color: '#ff4d4f'}}/>,
      'gateway-inclusive': <MinusCircleOutlined style={{color: '#ff4d4f'}}/>,
      'submit': <FileAddOutlined style={{color: '#722ed1'}}/>,
      'add-record': <PlusOutlined style={{color: '#1890ff'}}/>,
      'update-record': <EditOutlined style={{color: '#1890ff'}}/>,
      'query-record': <SearchOutlined style={{color: '#1890ff'}}/>,
      'delete-record': <MinusOutlined style={{color: '#1890ff'}}/>,
      'js-script': <CodeOutlined style={{color: '#f7df1e'}}/>,
      'groovy-script': <CodeOutlined style={{color: '#4298b8'}}/>,
      'sql-script': <DatabaseOutlined style={{color: '#1890ff'}}/>,
      'call-api': <ApiOutlined style={{color: '#1890ff'}}/>,
      'call-service': <LinkOutlined style={{color: '#722ed1'}}/>,
    };
    return iconMap[iconType] || <UserOutlined/>;
  };

  // 处理拖拽开始
  const handleDragStart = (e: React.DragEvent, nodeType: NodeType, subType?: string) => {
    setDraggedNode(nodeType);
    e.dataTransfer.effectAllowed = 'copy';
    // 传递节点类型和子类型信息
    const dragData = {nodeType, subType};
    e.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
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
    <Card
      title="节点选择面板"
      style={{height: '100%', display: 'flex', flexDirection: 'column'}}
      styles={{body: {flex: 1, overflowY: 'auto', padding: '12px'}}}
      extra={
        <Button
          type="text"
          size="small"
          icon={<MenuFoldOutlined/>}
          onClick={onHide}
          title="隐藏节点面板"
        />
      }
    >
      <Collapse defaultActiveKey={['events', 'activities', 'gateways', 'serviceTasks', 'advanced']} ghost>
        {Object.entries(categorizedNodes).map(([category, nodes]) => (
          <Panel
            header={getCategoryTitle(category)}
            key={category}
            style={{marginBottom: 8}}
          >
            <Row gutter={[8, 8]}>
              {nodes.map((node, index) => (
                <Col span={12} key={`${node.type}-${index}`}>
                  <Card
                    size="small"
                    hoverable
                    draggable
                    onDragStart={(e) => handleDragStart(e, node.type, node.subType)}
                    onDragEnd={handleDragEnd}
                    style={{
                      opacity: draggedNode === node.type ? 0.5 : 1,
                    }}
                  >
                    <Space>
                      {getIcon(node.icon)}
                      <Text style={{fontSize: '12px'}}>{node.label}</Text>
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
