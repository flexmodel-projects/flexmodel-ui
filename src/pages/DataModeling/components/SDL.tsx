import React from "react";
import type {Model} from "../data";
import {Divider, Typography} from 'antd';

const {Paragraph} = Typography;

interface SDLViewProps {
  datasource: string;
  model?: Partial<Model>;
}

const SDL: React.FC<SDLViewProps> = ({model}) => {
  return (
    <>
      <div>
        {model?.name} {model?.comment}
      </div>
      <Divider />
      <div style={{backgroundColor: "rgb(240 240 240)", padding: 6}}>
        <Paragraph copyable style={{whiteSpace: "pre-wrap"}}>{model?.sdl}</Paragraph>
      </div>
    </>
  );
};

export default SDL;
