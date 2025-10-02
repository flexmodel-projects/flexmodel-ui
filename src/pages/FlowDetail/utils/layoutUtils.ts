import {Edge, Node} from '@xyflow/react';

/**
 * 为没有坐标的节点进行自动布局
 * 使用 BFS 算法进行分层布局（从左到右）
 */
export const applyAutoLayout = (nodes: Node[], edges: Edge[]): Node[] => {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const incomingCount = new Map<string, number>();

  // 初始化入度计数
  nodes.forEach(n => incomingCount.set(n.id, 0));
  edges.forEach(e => incomingCount.set(e.target, (incomingCount.get(e.target) || 0) + 1));

  // 入度为0的作为起点
  const queue: string[] = nodes.filter(n => (incomingCount.get(n.id) || 0) === 0).map(n => n.id);
  const levelMap = new Map<string, number>();
  queue.forEach(id => levelMap.set(id, 0));

  // BFS 计算每个节点层级
  for (let i = 0; i < queue.length; i++) {
    const cur = queue[i];
    const curLevel = levelMap.get(cur) || 0;
    edges.filter(e => e.source === cur).forEach(e => {
      if (!levelMap.has(e.target)) {
        levelMap.set(e.target, curLevel + 1);
        queue.push(e.target);
      }
    });
  }

  // 按层级分组并赋坐标
  const groups = new Map<number, string[]>();
  nodes.forEach(n => {
    const lv = levelMap.get(n.id) ?? 0;
    if (!groups.has(lv)) groups.set(lv, []);
    groups.get(lv)!.push(n.id);
  });

  const xGap = 220;
  const yGap = 150;
  const startX = 100;
  const startY = 80;

  Array.from(groups.keys()).sort((a, b) => a - b).forEach(lv => {
    const ids = groups.get(lv)!;
    ids.forEach((id, idx) => {
      const node = nodeMap.get(id)!;
      node.position = { x: startX + lv * xGap, y: startY + idx * yGap };
    });
  });

  return Array.from(nodeMap.values());
};
