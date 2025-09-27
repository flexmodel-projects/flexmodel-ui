import React, {useEffect, useMemo, useRef} from "react";
import "graphiql/style.css";
import "@graphiql/react/style.css";
import "@graphiql/plugin-explorer/style.css";
import "@graphiql/plugin-history/style.css";
import {executeQuery} from "@/services/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {HISTORY_PLUGIN} from "@graphiql/plugin-history";
import {GraphiQL} from "graphiql";
import {GraphQLData} from "@/types/api-management";
import {useGraphiQL} from "@graphiql/react";
import {theme} from "antd";

interface GraphQLProps {
  data: GraphQLData | undefined;
  onChange: (data: GraphQLData) => void | undefined;
}

// 简化的内部组件，只负责初始化和基本的事件监听
const GraphiQLInitializer: React.FC<{
  data: GraphQLData;
  onChange: (data: GraphQLData) => void;
}> = ({ data, onChange }) => {
  const queryEditor = useGraphiQL(state => state.queryEditor);
  const variableEditor = useGraphiQL(state => state.variableEditor);
  const headerEditor = useGraphiQL(state => state.headerEditor);
  const initializedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // 初始化编辑器内容（只执行一次）
  useEffect(() => {
    if (!initializedRef.current && queryEditor && variableEditor && headerEditor) {
      queryEditor.setValue(data.query || "");
      variableEditor.setValue(data.variables ? JSON.stringify(data.variables) : "{}");
      headerEditor.setValue(data.headers ? JSON.stringify(data.headers) : "{}");
      initializedRef.current = true;
    }
  }, [queryEditor, variableEditor, headerEditor, data.query, data.variables, data.headers]);

  // 简化的变化监听（只在编辑器就绪后设置一次）
  useEffect(() => {
    if (!queryEditor || !variableEditor || !headerEditor || !initializedRef.current) {
      return;
    }

    const handleChange = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        const currentQuery = queryEditor.getValue() || "";
        const currentVariables = variableEditor.getValue() || "{}";
        const currentHeaders = headerEditor.getValue() || "{}";

        onChange({
          operationName: data.operationName || "MyQuery",
          query: currentQuery,
          variables: currentVariables !== "{}" ? JSON.parse(currentVariables) : null,
          headers: currentHeaders !== "{}" ? JSON.parse(currentHeaders) : null,
        });
      }, 500); // 增加防抖时间
    };

    // 只添加一次事件监听器
    queryEditor.onDidChangeModelContent(handleChange);
    variableEditor.onDidChangeModelContent(handleChange);
    headerEditor.onDidChangeModelContent(handleChange);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [queryEditor, variableEditor, headerEditor, onChange, data.operationName]);

  return null;
};

const GraphQL: React.FC<GraphQLProps> = ({ data, onChange }: GraphQLProps) => {
  const { token } = theme.useToken();
  // 使用useMemo缓存explorer插件，避免重复创建
  const explorer = useMemo(() => explorerPlugin(), []);

  // 简化数据传递，避免频繁重新渲染
  const graphqlData = useMemo(() => ({
    operationName: data?.operationName || "MyQuery",
    query: data?.query || "",
    variables: data?.variables || null,
    headers: data?.headers || null,
  }), [data?.operationName, data?.query, data?.variables, data?.headers]);

  // 动态注入样式
  useEffect(() => {
    const styleId = 'graphiql-execute-button-custom';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      .graphiql-container .graphiql-toolbar > button:first-child {
        background-color: ${token.colorPrimary} !important;
        color: white !important;
        border: 1px solid ${token.colorPrimary} !important;
        border-top-color: ${token.colorPrimary} !important;
        border-right-color: ${token.colorPrimary} !important;
        border-bottom-color: ${token.colorPrimary} !important;
        border-left-color: ${token.colorPrimary} !important;
        outline: none !important;
        box-shadow: none !important;
      }
      .graphiql-container .graphiql-toolbar > button:first-child:hover {
        background-color: ${token.colorPrimaryHover} !important;
        border-color: ${token.colorPrimaryHover} !important;
        border-top-color: ${token.colorPrimaryHover} !important;
        border-right-color: ${token.colorPrimaryHover} !important;
        border-bottom-color: ${token.colorPrimaryHover} !important;
        border-left-color: ${token.colorPrimaryHover} !important;
      }
      .graphiql-container .graphiql-toolbar > button:first-child:active {
        background-color: ${token.colorPrimaryActive} !important;
        border-color: ${token.colorPrimaryActive} !important;
        border-top-color: ${token.colorPrimaryActive} !important;
        border-right-color: ${token.colorPrimaryActive} !important;
        border-bottom-color: ${token.colorPrimaryActive} !important;
        border-left-color: ${token.colorPrimaryActive} !important;
      }
      .graphiql-container .graphiql-toolbar > button:first-child .graphiql-toolbar-icon {
        color: white !important;
      }

      /* Reduce editor font size for GraphiQL (supports CodeMirror 6 and Monaco) */
      .graphiql-container .cm-editor {
        font-size: ${token.fontSizeSM}px !important;
        line-height: 1.5;
      }
      .graphiql-container .cm-content {
        font-size: inherit !important;
      }
      .graphiql-container .monaco-editor,
      .graphiql-container .monaco-editor .margin,
      .graphiql-container .monaco-editor .view-lines {
        font-size: ${token.fontSize}px !important;
        line-height: 1.5 !important;
      }
    `;

    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, [token.colorPrimary, token.colorPrimaryHover, token.colorPrimaryActive, token.fontSizeSM]);

  return (
    <GraphiQL
      // forcedTheme={isDark ? "dark" : "light"}
      fetcher={executeQuery as any}
      plugins={[explorer, HISTORY_PLUGIN]}
    >
      <GraphiQLInitializer data={graphqlData} onChange={onChange} />
    </GraphiQL>
  );
};

export default GraphQL;
