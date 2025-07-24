import React, {useEffect, useRef} from "react";
import {Graph} from '@antv/x6';
import {Button, Card, Space} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {Entity, Field} from '@/types/data-modeling';

interface ERDiagramProps {
  data: Entity[];
}

// 生成节点 label 的 HTML 字符串
function getEntityTableHTML(entity: Entity) {
  return `
    <div style='padding:4px;'>
      <div style='font-weight:bold;text-align:center;'>${entity.name}</div>
      <table style='width:100%;border-collapse:collapse;font-size:12px;'>
        <tbody>
          ${(entity.fields || []).map((f: Field) => `
            <tr>
              <td style='border:1px solid #eee;padding:2px 4px;'>${f.concreteType}</td>
              <td style='border:1px solid #eee;padding:2px 4px;'>${f.name}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // 放大缩小
  const handleZoom = (delta: number) => {
    if (graphRef.current) {
      let zoom = graphRef.current.zoom() + delta;
      if (zoom < 0.2) zoom = 0.2;
      if (zoom > 2) zoom = 2;
      graphRef.current.zoomTo(zoom);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    if (graphRef.current) {
      graphRef.current.dispose();
      graphRef.current = null;
    }
    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 600,
      grid: true,
      panning: true,
      background: { color: '#f5f5f5' },
    });
    graphRef.current = graph;

    // 生成节点
    const nodes = (data || []).filter(e => e.type === 'ENTITY').map((entity, idx) => ({
      id: String(entity.name),
      x: 80 + (idx % 5) * 220,
      y: 80 + Math.floor(idx / 5) * 180,
      width: 200,
      height: 60 + (entity.fields?.length || 0) * 22,
      shape: 'rect',
      attrs: {
        body: { fill: '#fff', stroke: '#1890ff', strokeWidth: 1.5, rx: 8, ry: 8 },
        label: {
          html: getEntityTableHTML(entity),
          refX: 0.5,
          refY: 0.5,
          textWrap: {
            width: 200,
            height: 60 + (entity.fields?.length || 0) * 22,
            ellipsis: false,
          },
        },
      },
      label: '', // 必须设置 label，否则 X6 不渲染 label.attrs
    }));
    // 生成边
    const edges: any[] = [];
    (data || []).forEach((entity) => {
      if (entity.type === 'ENTITY') {
        (entity.fields || []).forEach((field: Field) => {
          if (field.type === 'Relation' && field.from && field.from !== entity.name) {
            edges.push({
              source: String(field.from),
              target: String(entity.name),
              label: field.name,
              attrs: { line: { stroke: '#aaa', strokeWidth: 1.2, targetMarker: 'classic' } },
            });
          }
        });
      }
    });
    graph.fromJSON({ nodes, edges });
    graph.centerContent();
  }, [data]);

  return (
    <Card style={{ width: '100%', height: '100%', minHeight: 600, position: 'relative', padding: 0 }} bodyStyle={{ padding: 0 }}>
      <Space style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <Button icon={<PlusOutlined />} onClick={() => handleZoom(0.1)} />
        <Button icon={<MinusOutlined />} onClick={() => handleZoom(-0.1)} />
      </Space>
      <div ref={containerRef} style={{ width: '100%', height: 600 }} />
    </Card>
  );
};

export default ERDiagram;
