import React from "react";
import {ApiMeta} from "@/types/api-management";
import GraphQL from "@/pages/GraphQLAPI/components/GraphQL";

interface ExecuteConfigProps {
  data: ApiMeta;
  onChange: (data: ApiMeta) => void;
}

const ExecutionForm: React.FC<ExecuteConfigProps> = ({ data, onChange }: ExecuteConfigProps) => {

  return (
    <div style={{ height: 'calc(100vh - 225px)', overflow: 'scroll' }}>
      <GraphQL
        data={{
          query: data.execution?.query || "",
          variables: data.execution?.variables || null,
          headers: data.execution?.headers || null,
        }}
        onChange={(r) => {
          const newData = { ...data, execution: r };
          onChange(newData as ApiMeta);
        }}
      />
    </div>
  );
};

export default ExecutionForm;
