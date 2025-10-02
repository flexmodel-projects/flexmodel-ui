import {useCallback} from 'react';
import {Node} from '@xyflow/react';
import {NodeInstance} from '@/services/flow.ts';

interface UseElementInstanceMergerProps {
  setNodes: (updater: (nodes: Node[]) => Node[]) => void;
}

export const useElementInstanceMerger = ({ setNodes }: UseElementInstanceMergerProps) => {
  const mergeElementInstances = useCallback((instances: NodeInstance[]) => {
    if (!instances || instances.length === 0) return;

    const byKey = new Map<string, NodeInstance>();
    const byNodeKey = new Map<string, NodeInstance>();

    instances.forEach(ins => {
      if ((ins as any).key) {
        byKey.set((ins as any).key as string, ins);
      }
      if ((ins as any).nodeKey) {
        byNodeKey.set((ins as any).nodeKey as string, ins);
      }
    });

    setNodes(prev => prev.map(n => {
      const match = byKey.get(n.id) || byNodeKey.get(n.id);
      if (!match) return n;
      return {
        ...n,
        data: {
          ...n.data,
          status: match.status,
        }
      } as Node;
    }));
  }, [setNodes]);

  return { mergeElementInstances };
};
