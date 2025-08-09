import React, {useEffect, useState} from "react";
import "graphiql/graphiql.css";
import "@graphiql/plugin-explorer/dist/style.css";
import {Card} from "antd";
import {executeQuery} from "@/services/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {GraphiQL} from "graphiql";
import {GraphQLData} from "@/types/api-management";
import {useTheme} from "@/store/appStore.ts";

interface GraphQLProps {
  data?: GraphQLData | undefined;
  onChange?: (data: GraphQLData) => void | undefined;
  endpointUrl?: string;
}

const GraphQL: React.FC<GraphQLProps> = ({ data, onChange, endpointUrl }: GraphQLProps) => {
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
        query={query}
        operationName={operationName}
        headers={headers}
        variables={variables}
        forcedTheme={isDark ? "dark" : "light"}
        onEditQuery={(value) => {
          setQuery(value);
          if (onChange) {
            onChange({
              operationName: operationName,
              query: value,
              variables: variables ? JSON.parse(variables) : null,
              headers: headers ? JSON.parse(headers) : null,
            });
          }
        }}
        onEditVariables={(value) => {
          setVariables(value);
          if (onChange) {
            onChange({
              operationName: operationName,
              query: query,
              variables: value ? JSON.parse(value) : null,
              headers: headers ? JSON.parse(headers) : null,
            });
          }
        }}
        onEditOperationName={(value) => {
          setOperationName(value);
          if (onChange) {
            onChange({
              operationName: value,
              query: query,
              variables: variables ? JSON.parse(variables) : null,
              headers: headers ? JSON.parse(headers) : null,
            });
          }
        }}
        onEditHeaders={(value) => {
          setHeaders(value);
          if (onChange) {
            onChange({
              operationName: operationName,
              query: query,
              variables: variables ? JSON.parse(variables) : null,
              headers: value ? JSON.parse(value) : null,
            });
          }
        }}
        fetcher={endpointUrl ?
          ((params: any) => fetch(endpointUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...params.headers
            },
            body: JSON.stringify({
              query: params.query,
              variables: params.variables,
              operationName: params.operationName
            })
          }).then(response => response.json())) :
          executeQuery as any
        }
        plugins={[explorer]}
        /*visiblePlugin={explorer}*/
      ></GraphiQL>
    </Card>
  );
};

export default GraphQL;
