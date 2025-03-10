import React, { useEffect, useRef } from "react";
import { Graph } from "@antv/x6";
import dagre from "dagre";

interface ERDiagramProps {
  datasource: any;
  data: any[];
}

const ERDiagram: React.FC<ERDiagramProps> = ({ data }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  // 添加自动布局方法
  const layout = (graph: Graph) => {
    const nodes = graph.getNodes();
    const edges = graph.getEdges();

    const g = new dagre.graphlib.Graph();
    g.setGraph({
      rankdir: "LR", // 布局方向：从左到右
      nodesep: 60, // 节点间距
      ranksep: 80, // 层级间距
      align: "DL", // 对齐方式
      marginx: 20, // 水平边距
      marginy: 20, // 垂直边距
    });
    g.setDefaultEdgeLabel(() => ({}));

    // 添加节点
    nodes.forEach((node) => {
      g.setNode(node.id, {
        width: node.getSize().width,
        height: node.getSize().height,
      });
    });

    // 添加边
    edges.forEach((edge) => {
      // const source = edge.getSource();
      // const target = edge.getTarget();
      const sourceId = edge.getSourceCellId();
      const targetId = edge.getTargetCellId();
      g.setEdge(sourceId, targetId);
    });

    // 执行布局
    dagre.layout(g);

    // 应用布局结果
    graph.batchUpdate(() => {
      nodes.forEach((node) => {
        const nodeWithPosition = g.node(node.id);
        node.position(nodeWithPosition.x, nodeWithPosition.y);
      });
    });
  };

  useEffect(() => {
    if (containerRef.current) {
      // 初始化 X6 图实例
      graphRef.current = new Graph({
        container: containerRef.current,
        width: 1000,
        height: 800,
        panning: {
          enabled: true,
          modifiers: "shift",
        },
        mousewheel: {
          enabled: true,
          modifiers: ["ctrl", "meta"],
        },
        scaling: {
          min: 0.5,
          max: 2,
        },
        grid: {
          size: 10,
          visible: true,
        },
        // connecting: {
        //   router: "manhattan", // 使用曼哈顿路由，让连线更整齐
        //   connector: "rounded", // 圆角连接器
        //   anchor: "center", // 连线锚点
        //   connectionPoint: "boundary", // 连接点
        // },
        // interacting: {
        //   nodeMovable: true, // 允许节点拖动
        //   edgeMovable: true, // 允许边拖动
        //   edgeLabelMovable: true, // 允许边标签拖动
        // },
      });

      const nodesMap: Record<string, string> = {};

      // 生成节点
      data.forEach((entity) => {
        if (entity.type === "ENTITY") {
          const { name, fields } = entity;
          let content = `<div><strong>${name}</strong></div>`;
          content += '<ul style="padding-left:16px;margin:4px 0;">';
          fields.forEach((field: any) => {
            content += `<li>${field.name}: ${field.concreteType}</li>`;
          });
          content += "</ul>";

          const node = graphRef.current!.addNode({
            id: name,
            width: 200, // 固定宽度
            height: Math.max(100, 30 + fields.length * 20), // 根据字段数量动态调整高度
            shape: "rect",
            attrs: {
              body: {
                fill: "#f8f9fa",
                stroke: "#ddd",
                strokeWidth: 1,
                rx: 6, // 圆角
                ry: 6,
              },
              label: {
                text: "",
              },
            },
            markup: [
              {
                tagName: "rect",
                selector: "body",
              },
              {
                tagName: "foreignObject",
                selector: "content",
                attrs: {
                  width: "100%",
                  height: "100%",
                  style: "overflow: auto;",
                },
              },
            ],
          });

          node.prop(
            "attrs/content/html",
            `<div style="padding:10px; font-size:12px; word-break: break-all; white-space: normal;">${content}</div>`
          );

          nodesMap[name] = node.id;
        }
      });

      const addedEdges = new Set<string>();

      // 生成连线
      data.forEach((entity) => {
        if (entity.type === "ENTITY") {
          const { name: currentEntity, fields } = entity;
          fields.forEach((field: any) => {
            if (field.type === "RELATION") {
              // 根据关系定义确定连线另一端的实体
              const targetEntity = field.from;
              // 使用 sorted key 去重，防止反向重复创建同一关系
              const edgeKey = [currentEntity, targetEntity].sort().join("--");
              if (!addedEdges.has(edgeKey)) {
                addedEdges.add(edgeKey);
                graphRef.current!.addEdge({
                  source: { cell: nodesMap[targetEntity] },
                  target: { cell: nodesMap[currentEntity] },
                  attrs: {
                    line: {
                      stroke: "#A2B1C3",
                      strokeWidth: 1,
                      targetMarker: {
                        name: "block",
                        width: 8,
                        height: 8,
                      },
                    },
                  },
                  label: {
                    position: 0.5,
                    attrs: {
                      text: {
                        text: field.name,
                        fill: "#6a6c8a",
                        fontSize: 10,
                        textAnchor: "middle",
                        textVerticalAnchor: "middle",
                      },
                      // rect: {
                      //   fill: "#fff",
                      //   stroke: "#E5E8EF",
                      //   strokeWidth: 1,
                      //   rx: 3,
                      //   ry: 3,
                      // },
                    },
                    // markup: [
                    //   {
                    //     tagName: "rect",
                    //     selector: "rect",
                    //   },
                    //   {
                    //     tagName: "text",
                    //     selector: "text",
                    //   },
                    // ],
                  },
                });
              }
            }
          });
        }
      });

      // 应用布局
      layout(graphRef.current);

      // 自动调整画布大小以适应内容
      graphRef.current.zoomToFit({ padding: 20 });
    }
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "800px", border: "1px solid #ddd" }}
    />
  );
};

export default ERDiagram;
