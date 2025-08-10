import React, {useEffect, useState} from "react";
import "graphiql/style.css";
import "@graphiql/react/style.css";
import "@graphiql/plugin-explorer/style.css";
import {Card} from "antd";
import {executeQuery} from "@/services/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {GraphiQL} from "graphiql";
import {GraphQLData} from "@/types/api-management";
import {useTheme} from "@/store/appStore.ts";
import {useGraphiQL} from "@graphiql/react";

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

  useEffect(() => {
    if (queryEditor) {
      queryEditor.setValue(query);
    }
  }, [query, queryEditor]);

  useEffect(() => {
    if (variableEditor) {
      variableEditor.setValue(variables);
    }
  }, [variables, variableEditor]);

  useEffect(() => {
    if (headerEditor) {
      headerEditor.setValue(headers);
    }
  }, [headers, headerEditor]);

  // 简化的变化监听 - 使用定时器定期检查
  useEffect(() => {
    const interval = setInterval(() => {
      const currentQuery = queryEditor?.getValue() || "";
      const currentVariables = variableEditor?.getValue() || "{}";
      const currentHeaders = headerEditor?.getValue() || "{}";

      onChange({
        operationName: operationName,
        query: currentQuery,
        variables: currentVariables ? JSON.parse(currentVariables) : null,
        headers: currentHeaders ? JSON.parse(currentHeaders) : null,
      });
    }, 1000); // 每秒检查一次

    return () => clearInterval(interval);
  }, [queryEditor, variableEditor, headerEditor, onChange, operationName]);

  return null;
};

const GraphQL: React.FC<GraphQLProps> = ({ data, onChange }: GraphQLProps) => {
  localStorage.removeItem("graphiql:tabState");

  const { isDark } = useTheme();
  const [operationName, setOperationName] = useState<string>("MyQuery");
  const [query, setQuery] = useState<string>("");
  const [headers, setHeaders] = useState<string>("{}");
  const [variables, setVariables] = useState<string>("{}");

  useEffect(() => {
    setOperationName(data?.operationName || "MyQuery");
    setQuery(data?.query || "");
    if (data?.headers) {
      setHeaders(JSON.stringify(data.headers));
    } else {
      setHeaders("{}");
    }
    if (data?.variables) {
      setVariables(JSON.stringify(data.variables));
    } else {
      setVariables("{}");
    }
  }, [data]);

  const explorer = explorerPlugin();

  return (
    <Card className="h-full">
      <GraphiQL
        className="text-[12px] [&_h2]:text-[18px] [&_h3]:text-[17px] [&_h4]:text-[16px]"
        forcedTheme={isDark ? "dark" : "light"}
        fetcher={executeQuery as any}
        plugins={[explorer]}
        defaultEditorToolsVisibility={true}
      >
        <GraphiQLInitializer
          query={query}
          operationName={operationName}
          headers={headers}
          variables={variables}
          onChange={onChange}
        />
      </GraphiQL>
    </Card>
  );
};

export default GraphQL;
