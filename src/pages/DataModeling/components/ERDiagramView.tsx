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

interface ERDiagramProps {
  data: Entity[];
  datasource: string;
  layout?: 'grid' | 'relation';
}

const ERDiagram: React.FC<ERDiagramProps> = ({ data, layout: externalLayout = 'grid' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);
  // 新增：全屏状态
  const [fullscreen, setFullscreen] = React.useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  // 新增：夜间模式监听
  const [isDark, setIsDark] = useState(() => getDarkModeFromStorage());
  // 新增：布局模式状态 - 'relation'为关系布局，'grid'为网状布局
  const isAutoLayout = externalLayout === 'relation';

  // 新增：保存原始节点位置
  const originalPositionsRef = useRef<{ [key: string]: { x: number; y: number } }>({});

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

  // 新增：自动布局算法
  const handleAutoLayout = () => {
    if (!graphRef.current || !data) return;

    const entities = (data || []).filter(e => e.type === 'ENTITY');
    if (entities.length === 0) return;

    if (!isAutoLayout) {
      // 恢复到网状布局
      const nodes = graphRef.current.getNodes();
      nodes.forEach(node => {
        const entityName = node.id;
        const originalPosition = originalPositionsRef.current[entityName];
        if (originalPosition) {
          node.position(originalPosition.x, originalPosition.y);
        }
      });
      
      // 重新生成边
      const edges: any[] = [];
      entities.forEach((entity) => {
        if (entity.type === 'ENTITY') {
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

      // 清除现有边并添加新边
      const existingEdges = graphRef.current.getEdges();
      existingEdges.forEach(edge => edge.remove());
      graphRef.current.addEdges(edges);

      // 自动调整缩放和居中
      setTimeout(() => {
        graphRef.current?.zoomTo(0.6);
        graphRef.current?.centerContent();
      }, 100);
      
      return;
    }

    // 构建关系图
    const adjacencyList: { [key: string]: string[] } = {};
    const entityMap = new Map<string, Entity>();
    
    entities.forEach(entity => {
      entityMap.set(entity.name, entity);
      adjacencyList[entity.name] = [];
    });

    // 收集所有关系
    entities.forEach(entity => {
      (entity.fields || []).forEach((field: Field) => {
        if (field.type === 'Relation' && field.from && field.from !== entity.name) {
          if (adjacencyList[field.from]) {
            adjacencyList[field.from].push(entity.name);
          }
          if (adjacencyList[entity.name]) {
            adjacencyList[entity.name].push(field.from);
          }
        }
      });
    });

    // 使用BFS进行分层布局
    const visited = new Set<string>();
    const levels: string[][] = [];
    const queue: { entity: string; level: number }[] = [];
    
    // 找到入度最小的实体作为起始点
    const inDegrees: { [key: string]: number } = {};
    entities.forEach(entity => {
      inDegrees[entity.name] = 0;
    });
    
    entities.forEach(entity => {
      (entity.fields || []).forEach((field: Field) => {
        if (field.type === 'Relation' && field.from && field.from !== entity.name) {
          inDegrees[entity.name]++;
        }
      });
    });

    // 找到入度为0的实体作为起始点
    const startEntities = Object.keys(inDegrees).filter(key => inDegrees[key] === 0);
    if (startEntities.length === 0) {
      // 如果没有入度为0的实体，选择第一个实体
      startEntities.push(entities[0].name);
    }

    // BFS分层
    startEntities.forEach(startEntity => {
      if (!visited.has(startEntity)) {
        queue.push({ entity: startEntity, level: 0 });
        visited.add(startEntity);
        
        while (queue.length > 0) {
          const { entity, level } = queue.shift()!;
          
          if (!levels[level]) {
            levels[level] = [];
          }
          levels[level].push(entity);
          
          // 添加相邻实体到下一层
          (adjacencyList[entity] || []).forEach(neighbor => {
            if (!visited.has(neighbor)) {
              visited.add(neighbor);
              queue.push({ entity: neighbor, level: level + 1 });
            }
          });
        }
      }
    });

    // 处理孤立的实体
    entities.forEach(entity => {
      if (!visited.has(entity.name)) {
        if (!levels[0]) levels[0] = [];
        levels[0].push(entity.name);
      }
    });

    // 计算位置
    const nodePositions: { [key: string]: { x: number; y: number } } = {};
    const levelHeight = 300;
    const nodeWidth = 320;
    
    levels.forEach((levelEntities, levelIndex) => {
      const y = 80 + levelIndex * levelHeight;
      const totalWidth = levelEntities.length * nodeWidth;
      const startX = Math.max(80, (800 - totalWidth) / 2); // 假设容器宽度为800
      
      levelEntities.forEach((entityName, entityIndex) => {
        nodePositions[entityName] = {
          x: startX + entityIndex * nodeWidth,
          y: y
        };
      });
    });

    // 更新节点位置
    const nodes = graphRef.current.getNodes();
    nodes.forEach(node => {
      const entityName = node.id;
      const position = nodePositions[entityName];
      if (position) {
        node.position(position.x, position.y);
      }
    });

    // 重新生成边
    const edges: any[] = [];
    entities.forEach((entity) => {
      if (entity.type === 'ENTITY') {
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

    // 清除现有边并添加新边
    const existingEdges = graphRef.current.getEdges();
    existingEdges.forEach(edge => edge.remove());
    graphRef.current.addEdges(edges);

    // 自动调整缩放和居中
    setTimeout(() => {
      graphRef.current?.zoomTo(0.6);
      graphRef.current?.centerContent();
    }, 100);
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
        console.warn('清理图形实例时出错:', error);
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
    const nodes = (data || []).filter(e => e.type === 'ENTITY').map((entity, idx) => {
      const x = 80 + (idx % 5) * 320; // 横向间距加大
      const y = 80 + Math.floor(idx / 5) * 300; // 纵向间距加大
      
      // 保存原始位置
      originalPositionsRef.current[entity.name] = { x, y };
      
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
      if (entity.type === 'ENTITY') {
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
          console.warn('组件卸载时清理图形实例出错:', error);
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

  // 监听外部布局状态变化
  useEffect(() => {
    if (graphRef.current && data) {
      handleAutoLayout();
    }
  }, [externalLayout]);

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
            title="放大"
            style={{ borderRadius: 4 }}
          />
          <Button
            icon={<MinusOutlined />}
            onClick={() => handleZoom(-0.1)}
            title="缩小"
            style={{ borderRadius: 4 }}
          />

          <Button
            icon={fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={handleToggleFullscreen}
            title={fullscreen ? "退出全屏" : "全屏"}
            style={{ borderRadius: 4 }}
          />
        </Space>
      </div>
    </Card>
  );
};

export default ERDiagram;
