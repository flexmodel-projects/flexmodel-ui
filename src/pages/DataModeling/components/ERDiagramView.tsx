import React, {useEffect, useRef} from 'react';
import {Graph} from '@antv/x6';

interface ERDiagramProps {
  datasource: any;
  data: any[];
}

const ERDiagram: React.FC<ERDiagramProps> = ({data}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // 初始化 X6 图实例
      graphRef.current = new Graph({
        container: containerRef.current,
        width: 1000,
        height: 800,
        panning: {
          enabled: true,
          modifiers: 'shift',
        },
        scaling: {
          min: 0.5,
          max: 2,
        },
        grid: {
          size: 10,
          visible: true,
        },
      });

      // 用于存储每个实体节点，方便后续创建连线时根据名称查找
      const nodesMap: Record<string, string> = {};

      // 生成节点：遍历所有实体，为每个实体生成一个节点
      data.forEach((entity) => {
        if (entity.type === 'ENTITY') {
          const {name, fields} = entity;
          // 生成节点展示内容：实体名称和字段列表
          let content = `<div><strong>${name}</strong></div>`;
          content += '<ul style="padding-left:16px;margin:4px 0;">';
          fields.forEach((field: any) => {
            content += `<li>${field.name}: ${field.concreteType}</li>`;
          });
          content += '</ul>';

          // 添加节点到图中（使用简单的矩形）
          const node = graphRef.current!.addNode({
            id: name, // 使用实体名称作为节点 id
            x: Math.random() * 600, // 随机位置，可根据实际情况布局
            y: Math.random() * 400,
            width: 180,
            height: 100,
            shape: 'rect',
            attrs: {
              body: {
                fill: '#fff',
                stroke: '#000',
                strokeWidth: 1,
              },
              label: {
                text: '',
              },
            },
            markup: [
              {
                tagName: 'rect',
                selector: 'body',
              },
              {
                tagName: 'foreignObject',
                selector: 'content',
                attrs: {
                  width: '100%',
                  height: '100%',
                  style: 'overflow: auto;',
                },
              },
            ],
          });

          // 使用 foreignObject 渲染 HTML 内容，添加 CSS 样式确保文字换行
          node.prop(
            'attrs/content/html',
            `<div style="padding:10px; font-size:12px; word-break: break-all; white-space: normal;">${content}</div>`
          );

          // 保存节点 id，后续连线使用
          nodesMap[name] = node.id;
        }
      });

      // 用于去重（避免关系重复显示）
      const addedEdges = new Set<string>();

      // 生成连线：遍历每个实体中所有关系字段，创建连线
      data.forEach((entity) => {
        if (entity.type === 'ENTITY') {
          const {name: currentEntity, fields} = entity;
          fields.forEach((field: any) => {
            if (field.type === 'RELATION') {
              // 根据关系定义确定连线另一端的实体
              const targetEntity = field.from;
              // 使用 sorted key 去重，防止反向重复创建同一关系
              const edgeKey = [currentEntity, targetEntity].sort().join('--');
              if (!addedEdges.has(edgeKey)) {
                addedEdges.add(edgeKey);
                graphRef.current!.addEdge({
                  source: {cell: nodesMap[targetEntity]},
                  target: {cell: nodesMap[currentEntity]},
                  attrs: {
                    line: {
                      stroke: '#A2B1C3',
                      strokeWidth: 1,
                      targetMarker: {
                        name: 'block',
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
                        fill: '#6a6c8a',
                        fontSize: 10,
                      },
                    },
                  },
                });
              }
            }
          });
        }
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
    />
  );
};

export default ERDiagram;
