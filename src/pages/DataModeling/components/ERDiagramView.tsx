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
  const fields = entity.fields || [];
  return `
    <div class="er-entity">
      <div class="er-entity-header">${entity.name}</div>
      <div class="er-entity-fields">
        ${fields.map(f => `
          <div>
            <span class="field-name">${f.name}</span>
            <span class="field-type">${f.concreteType || f.type}</span>
          </div>
        `)}
      </div>
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
          html: getEntityTableHTML(entity), // 只渲染字段内容
          refX: 0.5,
          refY: 0.5,
          textWrap: {
            width: 200,
            height: 60 + (entity.fields?.length || 0) * 22,
            ellipsis: false,
          },
        },
      },
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
    <Card style={{ width: '100%', height: '100%', minHeight: 600, position: 'relative', padding: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: 600 }} />
      <Space style={{ position: 'absolute', top: 24, left: 24, zIndex: 10 }} direction="horizontal">
        <Button type="default" icon={<PlusOutlined />} onClick={() => handleZoom(0.1)} title="放大" />
        <Button type="default" icon={<MinusOutlined />} onClick={() => handleZoom(-0.1)} title="缩小" />
      </Space>
    </Card>
  );
};

export default ERDiagram;
