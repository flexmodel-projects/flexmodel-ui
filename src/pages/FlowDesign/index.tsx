import React, {useCallback, useState} from 'react';
import {Button, Layout, Space, theme} from 'antd';
import {useNavigate} from 'react-router-dom';
import {
  ArrowLeftOutlined,
  FileTextOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  RedoOutlined,
  SaveOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons';
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  EdgeTypes,
  MiniMap,
  Node,
  NodeTypes,
  ReactFlow,
  ReactFlowInstance,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import NodePanel from '@/pages/FlowDesign/components/NodePanel';
import PropertyPanel from '@/pages/FlowDesign/components/PropertyPanel';
import StartEventNode from '@/pages/FlowDesign/components/nodes/StartEventNode';
import EndEventNode from '@/pages/FlowDesign/components/nodes/EndEventNode';
import UserTaskNode from '@/pages/FlowDesign/components/nodes/UserTaskNode';
import ServiceTaskNode from '@/pages/FlowDesign/components/nodes/ServiceTaskNode';
import ExclusiveGatewayNode from '@/pages/FlowDesign/components/nodes/ExclusiveGatewayNode';
import ParallelGatewayNode from '@/pages/FlowDesign/components/nodes/ParallelGatewayNode';
import InclusiveGatewayNode from '@/pages/FlowDesign/components/nodes/InclusiveGatewayNode';
import CallActivityNode from '@/pages/FlowDesign/components/nodes/CallActivityNode';
import SequenceFlowNode from '@/pages/FlowDesign/components/nodes/SequenceFlowNode';
import ArrowEdge from '@/pages/FlowDesign/components/edges/ArrowEdge';
import {FlowElementType} from '@/pages/FlowDesign/types/flow.d';
import {generateId} from '@/pages/FlowDesign/utils/flow';
import {PageContainer} from '@/components/common';

const { Sider, Content } = Layout;

// 自定义节点类型
const nodeTypes: NodeTypes = {
  startEvent: StartEventNode,
  endEvent: EndEventNode,
  userTask: UserTaskNode,
  serviceTask: ServiceTaskNode,
  exclusiveGateway: ExclusiveGatewayNode,
  parallelGateway: ParallelGatewayNode,
  inclusiveGateway: InclusiveGatewayNode,
  callActivity: CallActivityNode,
  sequenceFlow: SequenceFlowNode,
};

// 自定义边类型
const edgeTypes: EdgeTypes = {
  arrow: ArrowEdge,
};

// 自定义边类型
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

const FlowDesign: React.FC = () => {
  const navigate = useNavigate();
  const { token } = theme.useToken();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [flowName, setFlowName] = useState('合同审批');
  const [flowTitle, setFlowTitle] = useState('test');
  const [flowStatus, setFlowStatus] = useState<'enabled' | 'disabled'>('enabled');
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [propertyPanelVisible, setPropertyPanelVisible] = useState(false);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<Node, CustomEdge> | null>(null);

  // 处理节点删除
  const handleNodeDelete = useCallback((nodeId: string) => {
    console.log('handleNodeDelete called with nodeId:', nodeId);
    setNodes((nds) => {
      console.log('Current nodes before deletion:', nds.map(n => n.id));
      const filteredNodes = nds.filter((node) => node.id !== nodeId);
      console.log('Nodes after deletion:', filteredNodes.map(n => n.id));
      return filteredNodes;
    });
    // 同时删除与该节点相关的边
    setEdges((eds) => {
      const filteredEdges = eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId);
      return filteredEdges;
    });
  }, [setNodes, setEdges]);

  // 初始化默认节点
  React.useEffect(() => {
    if (nodes.length === 0) {
      const startId = 'start-node';
      const endId = 'end-node';
      const defaultNodes: Node[] = [
        {
          id: startId,
          type: 'startEvent',
          position: { x: 100, y: 100 },
          data: { name: '开始', onDelete: handleNodeDelete },
        },
        {
          id: endId,
          type: 'endEvent',
          position: { x: 400, y: 100 },
          data: { name: '结束', onDelete: handleNodeDelete },
        },
      ];
      setNodes(defaultNodes);
      setEdges([{
        id: generateId('SequenceFlow'),
        type: 'arrow',
        source: startId,
        target: endId,
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete, onInsert: (id: string, t: string) => handleInsertNode(id, t) },
      } as CustomEdge]);
    }
  }, [nodes.length, setNodes, handleNodeDelete]);

  // 处理边删除
  const handleEdgeDelete = useCallback((edgeId: string) => {
    console.log('handleEdgeDelete called with edgeId:', edgeId);
    setEdges((eds) => {
      console.log('Current edges before deletion:', eds.map(e => e.id));
      const filteredEdges = eds.filter((edge) => edge.id !== edgeId);
      console.log('Edges after deletion:', filteredEdges.map(e => e.id));
      return filteredEdges;
    });
  }, [setEdges]);

  // 在线路上插入一个节点（替换当前边为两条边）
  const handleInsertNode = useCallback((edgeId: string, nodeType: string) => {
    setEdges((currentEdges) => {
      const edge = currentEdges.find((e) => e.id === edgeId);
      if (!edge) return currentEdges;

      const sourceNode = nodes.find((n) => n.id === edge.source);
      const targetNode = nodes.find((n) => n.id === edge.target);
      if (!sourceNode || !targetNode) return currentEdges;

      const midX = (sourceNode.position.x + targetNode.position.x) / 2;
      const midY = (sourceNode.position.y + targetNode.position.y) / 2;

      const newNode: Node = {
        id: generateId(nodeType),
        type: nodeType as any,
        position: { x: midX, y: midY },
        data: { name: '', onDelete: handleNodeDelete },
      };

      const firstEdge: CustomEdge = {
        id: generateId('SequenceFlow'),
        type: 'arrow',
        source: edge.source,
        target: newNode.id,
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete, onInsert: (id: string, t: string) => handleInsertNode(id, t) },
      };
      const secondEdge: CustomEdge = {
        id: generateId('SequenceFlow'),
        type: 'arrow',
        source: newNode.id,
        target: edge.target,
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete, onInsert: (id: string, t: string) => handleInsertNode(id, t) },
      };

      // 同步更新节点
      setNodes((nds) => [...nds, newNode]);

      // 用两条新边替换旧边
      return [...currentEdges.filter((e) => e.id !== edgeId), firstEdge, secondEdge];
    });
  }, [nodes, handleEdgeDelete, handleNodeDelete, setEdges, setNodes]);

  // 处理节点连接
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: CustomEdge = {
        ...params,
        id: generateId('SequenceFlow'),
        type: 'arrow' as const,
        data: {
          conditionsequenceflow: '',
          defaultConditions: 'false',
          onDelete: handleEdgeDelete,
          onInsert: (edgeId: string, nodeType: string) => handleInsertNode(edgeId, nodeType),
        },
      };
      setEdges((eds) => addEdge(newEdge as any, eds as any) as any);
    },
    [setEdges, handleEdgeDelete, handleInsertNode]
  );

  // 处理节点选择
  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setPropertyPanelVisible(true);
  }, []);

  // 处理画布点击
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setPropertyPanelVisible(false);
  }, []);

  // 处理画布拖拽放置
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;

      const point = reactFlowInstance
        ? reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY })
        : { x: event.clientX - 280, y: event.clientY - 64 };

      const newNode: Node = {
        id: generateId(nodeType),
        type: nodeType,
        position: point,
        data: {
          name: '',
          onDelete: handleNodeDelete,
        },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [reactFlowInstance, setNodes, handleNodeDelete]
  );

  // 处理拖拽悬停
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  // 实时更新缩放显示
  const handleMove = useCallback((_event: any, viewport: { zoom: number }) => {
    const percent = Math.round((((viewport?.zoom ?? reactFlowInstance?.getViewport().zoom) || 1) * 100));
    setZoomPercent(percent);
  }, [reactFlowInstance]);

  // 保存流程
  const handleSave = useCallback(() => {
    const flowModel = {
      flowElementList: [
        ...nodes.map(node => ({
          key: node.id,
          type: getNodeType(node.type || 'userTask'),
          incoming: edges.filter(edge => edge.target === node.id).map(edge => edge.id),
          outgoing: edges.filter(edge => edge.source === node.id).map(edge => edge.id),
          properties: node.data || {},
        })),
        ...edges.map(edge => ({
          key: edge.id,
          type: FlowElementType.SEQUENCE_FLOW,
          incoming: [edge.source],
          outgoing: [edge.target],
          properties: edge.data || {},
        })),
      ],
    };
    console.log('保存流程模型:', flowModel);
  }, [nodes, edges]);

  // 暂存流程
  const handleDraft = useCallback(() => {
    console.log('暂存流程');
  }, []);

  // moved above

  // 加载示例数据
  const loadExampleData = useCallback(() => {
    const exampleNodes: Node[] = [
      {
        id: 'startEvent1',
        type: 'startEvent',
        position: { x: 100, y: 100 },
        data: { name: '开始', onDelete: handleNodeDelete },
      },
      {
        id: 'userTask1',
        type: 'userTask',
        position: { x: 300, y: 100 },
        data: { name: '填写节点', onDelete: handleNodeDelete },
      },
      {
        id: 'exclusiveGateway1',
        type: 'exclusiveGateway',
        position: { x: 500, y: 100 },
        data: { name: '金额>5000', hookInfoIds: '[1,2]', onDelete: handleNodeDelete },
      },
      {
        id: 'userTask2',
        type: 'userTask',
        position: { x: 700, y: 50 },
        data: { name: '总经理审批', onDelete: handleNodeDelete },
      },
      {
        id: 'userTask3',
        type: 'userTask',
        position: { x: 700, y: 150 },
        data: { name: '业务经理审批', onDelete: handleNodeDelete },
      },
      {
        id: 'endEvent1',
        type: 'endEvent',
        position: { x: 900, y: 100 },
        data: { name: '结束', onDelete: handleNodeDelete },
      },
    ];

    const exampleEdges: CustomEdge[] = [
      {
        id: 'sequenceFlow1',
        type: 'arrow',
        source: 'startEvent1',
        target: 'userTask1',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete },
      },
      {
        id: 'sequenceFlow2',
        type: 'arrow',
        source: 'userTask1',
        target: 'exclusiveGateway1',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete },
      },
      {
        id: 'sequenceFlow3',
        type: 'arrow',
        source: 'exclusiveGateway1',
        target: 'userTask2',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: 'a>1&&b==1', defaultConditions: 'false', onDelete: handleEdgeDelete },
      },
      {
        id: 'sequenceFlow4',
        type: 'arrow',
        source: 'exclusiveGateway1',
        target: 'userTask3',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'true', onDelete: handleEdgeDelete },
      },
      {
        id: 'sequenceFlow5',
        type: 'arrow',
        source: 'userTask2',
        target: 'endEvent1',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete },
      },
      {
        id: 'sequenceFlow6',
        type: 'arrow',
        source: 'userTask3',
        target: 'endEvent1',
        sourceHandle: null,
        targetHandle: null,
        data: { conditionsequenceflow: '', defaultConditions: 'false', onDelete: handleEdgeDelete },
      },
    ];

    setNodes(exampleNodes);
    setEdges(exampleEdges);
  }, [setNodes, setEdges, handleEdgeDelete, handleNodeDelete]);

  return (
    <PageContainer title={<>
      <Button
        type="default"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{
          marginRight: 12,
          padding: '4px 8px',
          height: 'auto',
          border: '1px solid #d9d9d9',
          borderRadius: '6px',
          backgroundColor: '#fff',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
        }}
        title="返回上一页"
      >
        返回
      </Button>
      <FileTextOutlined style={{ marginRight: 8 }} />
      正在编辑「{flowName}」
    </>}
       extra={
         <Space>
           <Button
             icon={leftPanelCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
             onClick={() => setLeftPanelCollapsed(!leftPanelCollapsed)}
             title={leftPanelCollapsed ? '显示节点面板' : '隐藏节点面板'}
           />
           <Button
             icon={<MenuUnfoldOutlined />}
             onClick={() => setPropertyPanelVisible(true)}
             title="打开属性面板"
           />
           <Button icon={<UndoOutlined />} />
           <Button icon={<RedoOutlined />} />
          <Button icon={<ZoomOutOutlined />} onClick={() => reactFlowInstance?.zoomOut?.()} />
          <span>{zoomPercent}%</span>
          <Button icon={<ZoomInOutlined />} onClick={() => reactFlowInstance?.zoomIn?.()} />
           <Button onClick={loadExampleData}>加载示例</Button>
           <Button onClick={handleDraft}>暂存</Button>
           <Button type="primary" icon={<SaveOutlined />} onClick={handleSave}>
             保存
           </Button>
         </Space>
       }
    >
      <ReactFlowProvider>
        <Layout style={{ height: 'calc(100vh - 135px)' }}>
          {/* 左侧节点面板 */}
          <Sider
            width={280}
            collapsed={leftPanelCollapsed}
            collapsedWidth={0}
            style={{
              background: 'var(--ant-color-bg-container)',
              borderRight: '1px solid var(--ant-color-border)'
            }}
          >
            <NodePanel />
          </Sider>

          {/* 中间画布区域 */}
          <Content style={{ position: 'relative' }}>
            {/* 左侧面板隐藏时的提示按钮 */}
            {leftPanelCollapsed && (
              <Button
                type="primary"
                icon={<MenuUnfoldOutlined />}
                onClick={() => setLeftPanelCollapsed(false)}
                style={{
                  position: 'absolute',
                  top: 16,
                  left: 16,
                  zIndex: 1000,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                }}
                title="显示节点面板"
              >
                节点面板
              </Button>
            )}

            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              onPaneClick={onPaneClick}
              onDrop={onDrop}
              onDragOver={onDragOver}
              onMove={handleMove}
              onInit={(instance) => setReactFlowInstance(instance)}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              fitView
              snapToGrid
              snapGrid={[16, 16]}
              attributionPosition="bottom-left"
            >
              <Background/>
              <Controls position="bottom-right" />
              <MiniMap pannable maskColor={token.colorFillTertiary as any} nodeColor={token.colorFillSecondary as any} />
            </ReactFlow>
          </Content>

        </Layout>

        {/* 属性配置面板 - Drawer */}
        <PropertyPanel
          selectedNode={selectedNode}
          flowName={flowName}
          flowTitle={flowTitle}
          flowStatus={flowStatus}
          visible={propertyPanelVisible}
          onClose={() => setPropertyPanelVisible(false)}
          onFlowNameChange={setFlowName}
          onFlowTitleChange={setFlowTitle}
          onFlowStatusChange={setFlowStatus}
          onNodePropertyChange={(nodeId, properties) => {
            setNodes((nds) =>
              nds.map((node) => {
                if (node.id === nodeId) {
                  const updatedNode = { ...node, data: { ...node.data, ...properties } };

                  // 如果properties中包含坐标信息，更新节点位置
                  if (properties.positionX !== undefined || properties.positionY !== undefined) {
                    updatedNode.position = {
                      x: properties.positionX !== undefined ? properties.positionX : node.position.x,
                      y: properties.positionY !== undefined ? properties.positionY : node.position.y,
                    };
                  }

                  // 如果properties中包含尺寸信息，更新节点尺寸
                  if (properties.width !== undefined || properties.height !== undefined) {
                    updatedNode.style = {
                      ...updatedNode.style,
                      width: properties.width !== undefined ? properties.width : node.style?.width,
                      height: properties.height !== undefined ? properties.height : node.style?.height,
                    };
                  }

                  return updatedNode;
                }
                return node;
              })
            );
          }}
        />
      </ReactFlowProvider>
    </PageContainer>
  );
};

// 辅助函数：将节点类型转换为FlowElementType
function getNodeType(nodeType: string): FlowElementType {
  const typeMap: Record<string, FlowElementType> = {
    startEvent: FlowElementType.START_EVENT,
    endEvent: FlowElementType.END_EVENT,
    userTask: FlowElementType.USER_TASK,
    exclusiveGateway: FlowElementType.EXCLUSIVE_GATEWAY,
    parallelGateway: FlowElementType.PARALLEL_GATEWAY,
    inclusiveGateway: FlowElementType.INCLUSIVE_GATEWAY,
  };
  return typeMap[nodeType] || FlowElementType.USER_TASK;
}

export default FlowDesign;
