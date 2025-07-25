import React, {useEffect, useRef} from "react";
import {Graph} from '@antv/x6';
import {Button, Card, Space} from "antd";
// 新增引入全屏图标
import {FullscreenExitOutlined, FullscreenOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {Entity, Field} from '@/types/data-modeling';
import {register} from 'x6-html-shape';
import createRender from 'x6-html-shape/dist/react';
import ERNodeView from './ERNodeView';

interface ERDiagramProps {
  data: Entity[];
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
    // 注册React节点类型
    register({
      shape: 'er-react-node',
      render: createRender((props: { node: any }) => {
        const entity = props.node?.getData()?.entity;
        return <ERNodeView entity={entity} />;
      }),
      width: 200,
      height: 60,
    });
    const graph = new Graph({
      container: containerRef.current,
      width: containerRef.current.clientWidth,
      height: containerRef.current.clientHeight || 600,
      grid: {
        size: 16,
        visible: true,
        type: 'dot',
        args: {
          color: '#e3eaf3',
          thickness: 1,
        },
      },
      panning: true,
      background: { color: '#f0f4fa' },
    });
    graphRef.current = graph;

    // 生成节点
    const nodes = (data || []).filter(e => e.type === 'ENTITY').map((entity, idx) => ({
      id: String(entity.name),
      x: 80 + (idx % 5) * 360, // 横向间距加大
      y: 80 + Math.floor(idx / 5) * 320, // 纵向间距加大
      width: 200,
      height: 60 + (entity.fields?.length || 0) * 22,
      shape: 'er-react-node',
      data: { entity },
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
              attrs: { line: { stroke: '#4096ff', strokeWidth: 2, targetMarker: 'classic' } },
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
            boxShadow: '0 0 32px #4096ff22',
          }
          : {
            width: '100%',
            height: '100%',
            minHeight: 600,
            position: 'relative',
            padding: 0,
            overflow: 'hidden',
            background: '#f0f4fa',
          }
      }
    >
      <div
        ref={containerRef}
        style={{ width: fullscreen ? '100vw' : '100%', height: fullscreen ? '100vh' : 600, overflow: 'hidden' }}
      />
      <Space style={{ position: 'absolute', top: 34, left: 34, zIndex: 10 }} direction="horizontal">
        <Button
          type="default"
          icon={<PlusOutlined />}
          onClick={() => handleZoom(0.1)}
          title="放大"
          style={{ borderColor: '#4096ff', color: '#4096ff' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e3f0ff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
        />
        <Button
          type="default"
          icon={<MinusOutlined />}
          onClick={() => handleZoom(-0.1)}
          title="缩小"
          style={{ borderColor: '#4096ff', color: '#4096ff' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e3f0ff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
        />
        {/* 新增全屏按钮 */}
        <Button
          type="default"
          icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
          onClick={handleToggleFullscreen}
          title={fullscreen ? "退出全屏" : "全屏"}
          style={{ borderColor: '#4096ff', color: '#4096ff' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#e3f0ff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; }}
        />
      </Space>
    </Card>
  );
};

export default ERDiagram;
