import React, {useEffect, useRef, useState} from "react";
import {Graph} from '@antv/x6';
import {Button, Card, Space} from "antd";
// 新增引入全屏图标
import {FullscreenExitOutlined, FullscreenOutlined, MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {Entity, Field} from '@/types/data-modeling';
import {register} from 'x6-html-shape';
import createRender from 'x6-html-shape/dist/react';
import ERNodeView from './ERNodeView';
import {getDarkModeFromStorage} from '@/utils/darkMode';
import {t} from "i18next";

interface ERDiagramProps {
  data: Entity[];
  datasource: string;
}

const ERDiagram: React.FC<ERDiagramProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  // 新增：全屏状态
  const [fullscreen, setFullscreen] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // 新增：夜间模式监听
  const [isDark, setIsDark] = useState(() => getDarkModeFromStorage());

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

  // 新增：刷新key状态
  const [refreshKey, setRefreshKey] = useState(0);

  // 新增：监听全屏变化，自动同步状态
  React.useEffect(() => {
    const handleChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).msFullscreenElement
      );
      setFullscreen(isFull);

      // 退出全屏时，延迟刷新组件
      if (!isFull) {
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 100);
      }
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

    // 清理之前的图形实例
    if (graphRef.current) {
      try {
        graphRef.current.dispose();
      } catch (error) {
        console.warn(t('cleanup_graph_error'), error);
      }
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

    // 确保容器尺寸正确
    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 600;

    const graph = new Graph({
      container: containerRef.current,
      width: width,
      height: height,
      grid: {
        size: 16,
        visible: true,
        type: 'dot',
        args: {
          color: isDark ? '#333842' : '#e3eaf3',
          thickness: 1,
        },
      },
      panning: true,
      background: { color: isDark ? '#23232a' : '#f0f4fa' },
    });
    graphRef.current = graph;
    // 生成节点
    const nodes = (data || []).filter(e => e.type === 'entity').map((entity, idx) => {
      const x = 80 + (idx % 5) * 320; // 横向间距加大
      const y = 80 + Math.floor(idx / 5) * 300; // 纵向间距加大

      return {
        id: String(entity.name),
        x: x,
        y: y,
        width: 200,
        height: 60 + (entity.fields?.length || 0) * 22,
        shape: 'er-react-node',
        data: { entity },
      };
    });
    // 生成边
    const edges: any[] = [];
    (data || []).forEach((entity) => {
      if (entity.type === 'entity') {
        (entity.fields || []).forEach((field: Field) => {
          if (field.type === 'Relation' && field.from && field.from !== entity.name) {
            edges.push({
              source: String(field.from),
              target: String(entity.name),
              label: field.name,
              attrs: {
                line: {
                  stroke: isDark ? '#36a3f7' : '#4096ff',
                  strokeWidth: 2,
                  strokeDasharray: '8,4',
                  targetMarker: 'classic'
                }
              },
            });
          }
        });
      }
    });
    graph.fromJSON({ nodes, edges });
    graph.zoomTo(0.6); // 数据加载后再次确认缩放为50%
    setTimeout(() => {
      graph.zoomTo(0.6); // 延迟再次设置缩放，确保渲染完成后生效
      graph.centerContent();
      // 确保图形大小正确
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        if (width > 0 && height > 0) {
          graph.resize(width, height);
        }
      }
    }, 100);

    // 清理函数
    return () => {
      if (graphRef.current) {
        try {
          graphRef.current.dispose();
        } catch (error) {
          console.warn(t('cleanup_graph_error_unmount'), error);
        }
        graphRef.current = null;
      }
    };
  }, [data, isDark, refreshKey]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return (
    <Card
      ref={cardRef}
      bodyStyle={{ padding: 0, height: '100%' }}
      style={fullscreen
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
            overflow: 'hidden',
            boxShadow: 'none',
            background: isDark ? '#18181c' : '#fff',
          }
        : {
            width: '100%',
            height: '100%',
            position: 'relative',
            padding: 0,
            overflow: 'hidden',
            background: isDark ? '#23232a' : '#fafafa',
            borderRadius: 8,
            boxShadow: isDark ? '0 2px 8px rgba(0,0,0,0.6)' : '0 2px 8px rgba(0, 0, 0, 0.1)',
          }
      }
    >
      <div
        ref={containerRef}
        key={refreshKey}
        style={{ width: fullscreen ? '100vw' : '100%', height: fullscreen ? '100vh' : '100%', overflow: 'hidden' }}
      />
      <div style={{ position: 'absolute', top: 20, left: 20 }}>
        <Space direction="horizontal">
          <Button
            icon={<PlusOutlined />}
            onClick={() => handleZoom(0.1)}
            title={t('zoom_in')}
            style={{ borderRadius: 4 }}
          />
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleZoom(-0.1)}
            title={t('zoom_out')}
            style={{ borderRadius: 4 }}
          />

          <Button
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={handleToggleFullscreen}
            title={fullscreen ? t('exit_fullscreen') : t('fullscreen')}
            style={{ borderRadius: 4 }}
          />
        </Space>
      </div>
    </Card>
  );
};

export default ERDiagram;
