import React from "react";
import type {Model} from "../data";
import {Divider, Typography} from 'antd';

const {Paragraph} = Typography;

interface SDLViewProps {
  datasource: string;
  model?: Partial<Model>;
}

const CodeView: React.FC<SDLViewProps> = ({model}) => {
  return (
    <>
      <div>
        {model?.name} {model?.comment}
      </div>
      <Divider />
      <pre>
        <Paragraph copyable style={{whiteSpace: "pre-wrap"}}>{model?.sdl}</Paragraph>
      </pre>
    </>
  );
};

export default CodeView;
