import React, {useEffect, useRef} from "react";
import {Graph} from '@antv/x6';
import {Button, Card, Space} from "antd";
// 新增引入全屏图标
import {FullscreenExitOutlined, FullscreenOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
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
  // 新增：全屏状态
  const [fullscreen, setFullscreen] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // 放大缩小
  const handleZoom = (delta: number) => {
    if (graphRef.current) {
      let zoom = graphRef.current.zoom() + delta;
      if (zoom < 0.2) zoom = 0.2;
      if (zoom > 2) zoom = 2;
      graphRef.current.zoomTo(zoom);
      // 放大缩小时自动居中
      graphRef.current.centerContent();
    }
  };

  // 新增：自适应容器大小
  const resizeGraph = () => {
    if (containerRef.current && graphRef.current) {
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      graphRef.current.resize(width, height);
      graphRef.current.centerContent();
    }
  };

  // 新增：全屏切换方法
  const handleToggleFullscreen = () => {
    if (!cardRef.current) return;
    if (!fullscreen) {
      if (cardRef.current.requestFullscreen) {
        cardRef.current.requestFullscreen();
      } else if ((cardRef.current as any).webkitRequestFullscreen) {
        (cardRef.current as any).webkitRequestFullscreen();
      } else if ((cardRef.current as any).msRequestFullscreen) {
        (cardRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // 监听全屏和窗口resize
  React.useEffect(() => {
    if (!containerRef.current) return;
    resizeGraph();
    window.addEventListener('resize', resizeGraph);
    // 监听全屏变化时也resize
    document.addEventListener('fullscreenchange', resizeGraph);
    document.addEventListener('webkitfullscreenchange', resizeGraph);
    document.addEventListener('msfullscreenchange', resizeGraph);
    return () => {
      window.removeEventListener('resize', resizeGraph);
      document.removeEventListener('fullscreenchange', resizeGraph);
      document.removeEventListener('webkitfullscreenchange', resizeGraph);
      document.removeEventListener('msfullscreenchange', resizeGraph);
    };
  }, [fullscreen]);

  // 新增：监听全屏变化，自动同步状态
  React.useEffect(() => {
    const handleChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setFullscreen(isFull);
    };
    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
    };
  }, []);

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
    <Card
      ref={cardRef}
      style={
        fullscreen
          ? {
              width: '100vw',
              height: '100vh',
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 9999,
              padding: 0,
              borderRadius: 0,
              minHeight: 0,
              overflow: 'hidden', // 防止滚动条
            }
          : {
              width: '100%',
              height: '100%',
              minHeight: 600,
              position: 'relative',
              padding: 0,
              overflow: 'hidden',
            }
      }
    >
      <div
        ref={containerRef}
        style={{ width: fullscreen ? '100vw' : '100%', height: fullscreen ? '100vh' : 600, overflow: 'hidden' }}
      />
      <Space style={{ position: 'absolute', top: 34, left: 34, zIndex: 10 }} direction="horizontal">
        <Button type="default" icon={<PlusOutlined />} onClick={() => handleZoom(0.1)} title="放大" />
        <Button type="default" icon={<MinusOutlined />} onClick={() => handleZoom(-0.1)} title="缩小" />
        {/* 新增全屏按钮 */}
        <Button
          type="default"
          icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={handleToggleFullscreen}
          title={fullscreen ? "退出全屏" : "全屏"}
        />
      </Space>
    </Card>
  );
};

export default ERDiagram;
