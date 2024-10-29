import React, {useEffect, useState} from 'react';
import 'graphiql/graphiql.css';
import '@graphiql/plugin-explorer/dist/style.css';
import {executeQuery} from "../../../api/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {GraphiQL} from "graphiql";
import {css} from "@emotion/css";

interface GraphQLProps {
  data: any
  onChange: (data: any) => void | undefined
}

const GraphQL: React.FC<GraphQLProps> = ({data, onChange}: GraphQLProps) => {

  localStorage.removeItem('graphiql:tabState');

  useEffect(() => {
    setOperationName(data?.operationName);
    setQuery(data?.query);
    if (data?.headers) {
      setHeaders(JSON.stringify(data?.headers));
    }
    if (data?.variables) {
      setVariables(JSON.stringify(data?.variables));
    }
  }, [data]);

  const [operationName, setOperationName] = useState<string>('MyQuery')
  const [query, setQuery] = useState<string>('')
  const [headers, setHeaders] = useState<string>('{}')
  const [variables, setVariables] = useState<string>('{}')

  const explorer = explorerPlugin();

  return (
    <div style={{height: 540}}>
      <GraphiQL
        className={css`
          --font-size-body: 12px;
          --font-size-h2: 18px;
          --font-size-h3: 17px;
          --font-size-h4: 16px;
        `}
        query={query}
        operationName={operationName}
        headers={headers}
        variables={variables}
        onEditQuery={value => {
          setQuery(value)
          onChange({
            operationName: operationName,
            query: value,
            variables: variables ? JSON.parse(variables) : null,
            headers: headers ? JSON.parse(headers) : null
          })
        }}
        onEditVariables={value => {
          setVariables(value)
          onChange({
            operationName: operationName,
            query: query,
            variables: value ? JSON.parse(value) : null,
            headers: headers ? JSON.parse(headers) : null
          })
        }}
        onEditOperationName={value => {
          setOperationName(value)
          onChange({
            operationName: value,
            query: query,
            variables: variables ? JSON.parse(variables) : null,
            headers: headers ? JSON.parse(headers) : null
          })
        }}
        onEditHeaders={value => {
          setHeaders(value)
          onChange({
            operationName: operationName,
            query: query,
            variables: variables ? JSON.parse(variables) : null,
            headers: value ? JSON.parse(value) : null
          })
        }}
        fetcher={executeQuery}
        plugins={[explorer]}
        /*visiblePlugin={explorer}*/
      >
      </GraphiQL>
    </div>
  );
};

export default GraphQL;
