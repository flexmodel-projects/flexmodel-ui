import React, {useEffect, useState} from 'react';
import 'graphiql/graphiql.css';
import {graphqlExecute} from "../../../api/api-management.ts";
import {explorerPlugin} from "@graphiql/plugin-explorer";
import {GraphiQL} from "graphiql";

interface GraphQLProps {
  data: any
  onChange: (data: any) => void | undefined
}

const GraphQL: React.FC<GraphQLProps> = ({data, onChange}: GraphQLProps) => {

  useEffect(() => {
    setOperationName(data?.operationName)
    setQuery(data?.query)
    setHeaders(JSON.stringify(data?.headers))
    setVariables(JSON.stringify(data?.variables))
  }, [data]);

  const [operationName, setOperationName] = useState<string>('MyQuery')
  const [query, setQuery] = useState<string>('')
  const [headers, setHeaders] = useState<string>('{}')
  const [variables, setVariables] = useState<string>('{}')

  const explorer = explorerPlugin();

  return (
    <div>
      <GraphiQL
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
        fetcher={graphqlExecute}
        plugins={[explorer]}>
      </GraphiQL>
    </div>
  );
};

export default GraphQL;
