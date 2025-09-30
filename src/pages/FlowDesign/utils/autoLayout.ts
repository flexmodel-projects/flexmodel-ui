import dagre from 'dagre';
import {Edge, Node} from '@xyflow/react';

export interface LayoutedNode extends Node {
  position: { x: number; y: number };
}

export type LayoutedEdge = Edge;

/**
 * 使用 Dagre 算法对节点进行自动布局
 * @param nodes 节点数组
 * @param edges 边数组
 * @param direction 布局方向 'TB' | 'BT' | 'LR' | 'RL'
 * @param nodeWidth 节点默认宽度
 * @param nodeHeight 节点默认高度
 * @returns 布局后的节点和边
 */
export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'BT' | 'LR' | 'RL' = 'TB',
  nodeWidth = 120,
  nodeHeight = 60
): { nodes: LayoutedNode[]; edges: LayoutedEdge[] } => {
  // 根据图的复杂度动态调整间距
  const nodeCount = nodes.length;
  const edgeCount = edges.length;
  const complexity = edgeCount / Math.max(nodeCount, 1);

  // 复杂度越高，间距越大，以减少连线重叠
  const complexityMultiplier = Math.max(1, Math.min(2, 1 + complexity * 0.3));
  const dynamicNodesep = Math.round(80 * complexityMultiplier);
  const dynamicRanksep = Math.round(150 * complexityMultiplier);
  const dynamicEdgesep = Math.round(20 * complexityMultiplier);
  // 创建 dagre 图实例
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // 设置图的布局选项 - 使用动态计算的间距
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: dynamicNodesep, // 动态调整同级节点间距
    ranksep: dynamicRanksep, // 动态调整层级间距
    marginx: 40,
    marginy: 40,
    edgesep: dynamicEdgesep, // 动态调整边间距
    ranker: 'network-simplex', // 使用网络单纯形算法优化连线路径
    align: undefined, // 不强制对齐，让算法自由选择最佳位置
  });

  // 添加节点到 dagre 图
  nodes.forEach((node) => {
    // 使用节点的实际尺寸或默认尺寸
    const width = node.style?.width ? Number(node.style.width) : nodeWidth;
    const height = node.style?.height ? Number(node.style.height) : nodeHeight;

    dagreGraph.setNode(node.id, {
      width,
      height,
      // 保留节点原有数据
      ...node.data
    });
  });

  // 添加边到 dagre 图
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // 执行布局算法
  dagre.layout(dagreGraph);

  // 获取布局后的节点位置
  const layoutedNodes: LayoutedNode[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        // dagre 返回的是节点中心点坐标，需要转换为左上角坐标
        x: nodeWithPosition.x - (nodeWithPosition.width || nodeWidth) / 2,
        y: nodeWithPosition.y - (nodeWithPosition.height || nodeHeight) / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges: edges as LayoutedEdge[],
  };
};

/**
 * 自动布局的预设配置
 */
export const layoutPresets = {
  // 从上到下 (默认)
  topToBottom: { direction: 'TB' as const, nodeWidth: 120, nodeHeight: 60 },
  // 从左到右 - 优化横向布局，减少连线重叠
  leftToRight: { direction: 'LR' as const, nodeWidth: 140, nodeHeight: 80 },
  // 从下到上
  bottomToTop: { direction: 'BT' as const, nodeWidth: 120, nodeHeight: 60 },
  // 从右到左
  rightToLeft: { direction: 'RL' as const, nodeWidth: 140, nodeHeight: 80 },
  // 紧凑布局
  compact: { direction: 'TB' as const, nodeWidth: 100, nodeHeight: 50 },
  // 宽松布局 - 进一步增加间距以避免连线重叠
  spacious: { direction: 'LR' as const, nodeWidth: 160, nodeHeight: 100 },
};

/**
 * 智能自动布局 - 根据图的复杂度自动选择最佳布局参数
 * @param nodes 节点数组
 * @param edges 边数组
 * @param direction 布局方向
 * @returns 布局后的节点和边
 */
export const getSmartLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'BT' | 'LR' | 'RL' = 'LR'
): { nodes: LayoutedNode[]; edges: LayoutedEdge[] } => {
  const nodeCount = nodes.length;
  const edgeCount = edges.length;

  // 根据节点和边的数量选择合适的预设
  let preset: { direction: 'TB' | 'BT' | 'LR' | 'RL'; nodeWidth: number; nodeHeight: number };

  if (nodeCount > 15 || edgeCount > 20) {
    // 复杂图形使用宽松布局，但保持传入的方向
    preset = {
      direction: direction,
      nodeWidth: 160,
      nodeHeight: 100
    };
  } else if (nodeCount < 5 && edgeCount < 5) {
    // 简单图形可以使用紧凑布局
    preset = {
      direction: direction,
      nodeWidth: 120,
      nodeHeight: 70
    };
  } else {
    // 默认使用左到右布局，但保持传入的方向
    preset = {
      direction: direction,
      nodeWidth: 140,
      nodeHeight: 80
    };
  }

  return getLayoutedElements(
    nodes,
    edges,
    direction,
    preset.nodeWidth,
    preset.nodeHeight
  );
};
