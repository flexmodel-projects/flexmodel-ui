import {useCallback} from 'react';
import {message} from 'antd';
import {Edge, Node} from '@xyflow/react';
import {FlowElementType} from '@/pages/FlowDesign/types/flow.ts';
import {applyAutoLayout} from '../utils/layoutUtils';

interface UseFlowParserProps {
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const useFlowParser = ({ setNodes, setEdges }: UseFlowParserProps) => {
  const getNodeTypeFromFlowElementType = (type: number): string => {
    // 统一使用只读展示组件，同时引用type避免未使用参数告警
    void type;
    return 'flowNode';
  };

  const parseFlowModel = useCallback((flowModelStr: string) => {
    try {
      const flowModel = JSON.parse(flowModelStr);
      const { flowElementList } = flowModel;
      if (!flowElementList || !Array.isArray(flowElementList)) return;

      const parsedNodes: Node[] = [];
      const parsedEdges: Edge[] = [];
      const elementByKey = new Map<string, any>();
      flowElementList.forEach((el: any) => elementByKey.set(el.key, el));

      // 先创建节点（不做默认递增布局，先记录原始坐标，如果没有坐标后续统一布局）
      const nodesWithoutPos: string[] = [];
      flowElementList.forEach((element: any) => {
        if (element.type !== FlowElementType.SEQUENCE_FLOW) {
          const nodeType = getNodeTypeFromFlowElementType(element.type);
          const hasPos = element.properties && (element.properties.positionX !== undefined && element.properties.positionY !== undefined);
          const x = hasPos ? element.properties.positionX : 0;
          const y = hasPos ? element.properties.positionY : 0;
          if (!hasPos) nodesWithoutPos.push(element.key);
          parsedNodes.push({
            id: element.key,
            type: nodeType as any,
            position: { x, y },
            data: {
              name: element.properties?.name || '',
              key: element.key,
              flowElementType: element.type,
              ...element.properties,
            },
          });
        }
      });

      // 基于"节点的 outgoing -> 对应的 sequenceFlow -> 目标节点"构建边（唯一来源，最稳妥）
      flowElementList.forEach((element: any) => {
        if (element.type !== FlowElementType.SEQUENCE_FLOW) {
          const outList: string[] = element.outgoing || [];
          outList.forEach((edgeKey) => {
            const edgeEl = elementByKey.get(edgeKey);
            if (edgeEl && edgeEl.type === FlowElementType.SEQUENCE_FLOW) {
              const src = element.key;
              const tgt = edgeEl.outgoing?.[0];
              if (tgt && elementByKey.has(tgt)) {
                const edgeProps = edgeEl.properties || {};
                const condition: string | undefined = typeof edgeProps.conditionsequenceflow === 'string' ? edgeProps.conditionsequenceflow : undefined;
                const isDefault: boolean = edgeProps.defaultConditions === true || edgeProps.defaultConditions === 'true';
                const edgeLabel: string | undefined = (condition && condition.trim()) ? condition : (isDefault ? '默认' : undefined);

                parsedEdges.push({
                  id: edgeEl.key,
                  source: src,
                  target: tgt,
                  sourceHandle: 'right',
                  targetHandle: 'left',
                  data: edgeProps,
                  ...(edgeLabel ? { label: edgeLabel } : {}),
                } as Edge);
              }
            }
          });
        }
      });

      // 如果整体没有坐标，做一个简单的 BFS 分层布局（左->右）
      const needsLayout = nodesWithoutPos.length === parsedNodes.length; // 所有节点都无坐标，才启用自动布局
      const finalNodes = needsLayout ? applyAutoLayout(parsedNodes, parsedEdges) : parsedNodes;

      setNodes(finalNodes);
      setEdges(parsedEdges);
    } catch (e) {
      console.error('解析流程模型失败', e);
      message.error('解析流程模型失败');
    }
  }, [setNodes, setEdges]);

  return { parseFlowModel };
};
