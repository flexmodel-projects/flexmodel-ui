import React, {useEffect, useMemo} from "react";
import "graphiql/style.css";
import "@graphiql/react/style.css";
import "@graphiql/plugin-explorer/style.css";
import "@graphiql/plugin-history/style.css";
import {executeQuery} from "@/services/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {HISTORY_PLUGIN} from "@graphiql/plugin-history";
import {GraphiQL} from "graphiql";
import {GraphQLData} from "@/types/api-management";
import {useTheme} from "@/store/appStore.ts";
import {useGraphiQL} from "@graphiql/react";
import {theme} from "antd";

interface GraphQLProps {
  data: GraphQLData | undefined;
  onChange: (data: GraphQLData) => void | undefined;
}

// 内部组件用于设置初始值
const GraphiQLInitializer: React.FC<{
  query: string;
  operationName: string;
  headers: string;
  variables: string;
  onChange: (data: GraphQLData) => void;
}> = ({ query, operationName, headers, variables, onChange }) => {
  const queryEditor = useGraphiQL(state => state.queryEditor);
  const variableEditor = useGraphiQL(state => state.variableEditor);
  const headerEditor = useGraphiQL(state => state.headerEditor);

  // 只在编辑器初始化时设置值，避免重复设置
  useEffect(() => {
    if (queryEditor && query !== queryEditor.getValue()) {
      queryEditor.setValue(query);
    }
  }, [queryEditor, query]); // 添加query依赖

  useEffect(() => {
    if (variableEditor && variables !== variableEditor.getValue()) {
      variableEditor.setValue(variables);
    }
  }, [variableEditor, variables]); // 添加variables依赖

  useEffect(() => {
    if (headerEditor && headers !== headerEditor.getValue()) {
      headerEditor.setValue(headers);
    }
  }, [headerEditor, headers]); // 添加headers依赖

  // 使用防抖来优化变化监听
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleQueryChange = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentQuery = queryEditor?.getValue() || "";
        const currentVariables = variableEditor?.getValue() || "{}";
        const currentHeaders = headerEditor?.getValue() || "{}";

        onChange({
          operationName: operationName,
          query: currentQuery,
          variables: currentVariables ? JSON.parse(currentVariables) : null,
          headers: currentHeaders ? JSON.parse(currentHeaders) : null,
        });
      }, 300); // 300ms防抖
    };

    // 监听编辑器的变化事件
    if (queryEditor) {
      queryEditor.onDidChangeModelContent(handleQueryChange);
    }
    if (variableEditor) {
      variableEditor.onDidChangeModelContent(handleQueryChange);
    }
    if (headerEditor) {
      headerEditor.onDidChangeModelContent(handleQueryChange);
    }

    return () => {
      clearTimeout(timeoutId);
      // 注意：GraphiQL的编辑器事件监听器会在编辑器销毁时自动清理
    };
  }, [queryEditor, variableEditor, headerEditor, onChange, operationName]);

  return null;
};

const GraphQL: React.FC<GraphQLProps> = ({ data, onChange }: GraphQLProps) => {
  localStorage.removeItem("graphiql:tabState");

  const { isDark } = useTheme();
  const { token } = theme.useToken();

  // 使用useMemo缓存explorer插件，避免重复创建
  const explorer = useMemo(() => explorerPlugin(), []);

  // 使用useMemo缓存GraphiQLInitializer的props，避免不必要的重新渲染
  const initializerProps = useMemo(() => ({
    query: data?.query || "",
    operationName: data?.operationName || "MyQuery",
    headers: data?.headers ? JSON.stringify(data.headers) : "{}",
    variables: data?.variables ? JSON.stringify(data.variables) : "{}",
    onChange: onChange,
  }), [data?.query, data?.operationName, data?.headers, data?.variables, onChange]);

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
    `;
    
    return () => {
      const element = document.getElementById(styleId);
      if (element) {
        document.head.removeChild(element);
      }
    };
  }, [token.colorPrimary, token.colorPrimaryHover, token.colorPrimaryActive]);

  return (
    <GraphiQL
      forcedTheme={isDark ? "dark" : "light"}
      fetcher={executeQuery as any}
      plugins={[explorer, HISTORY_PLUGIN]}
    >
      <GraphiQLInitializer {...initializerProps} />
    </GraphiQL>
  );
};

export default GraphQL;
