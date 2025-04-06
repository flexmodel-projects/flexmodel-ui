import React from "react";
import type {Model} from "../data";
import {Divider, Typography} from 'antd';

const {Paragraph} = Typography;

interface CodeViewProps {
  datasource: string;
  model?: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({model}) => {
  return (
    <>
      <div>
        {model?.name} {model?.comment}
      </div>
      <Divider />
      <pre>
        <Paragraph copyable style={{whiteSpace: "pre-wrap"}}>{model?.idl}</Paragraph>
      </pre>
    </>
  );
};

export default CodeView;
