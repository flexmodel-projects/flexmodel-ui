import React from 'react';
import {Form} from 'antd';
import type {DatasourceSchema} from "@/types/data-source";
import {normalizeDatasource} from "@/pages/DataSource/utils";
import DataSourceForm from "@/pages/DataSource/components/DataSourceForm";

interface DataSourceViewProps { 
  data: DatasourceSchema;
}

const DataSourceView: React.FC<DataSourceViewProps> = ({ data }) => {
  const flat = normalizeDatasource(data);

  return (
    <Form
      layout="vertical"
      variant="borderless"
      initialValues={flat}
      key={`${flat.name}-view`}
    >
      <DataSourceForm readOnly />
    </Form>
  );
};

export default DataSourceView;
