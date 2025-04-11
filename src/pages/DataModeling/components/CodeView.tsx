import React from "react";
import type {Model} from "../data";
import {Button, Divider, message, Space, Typography} from 'antd';
import {BASE_URI, getFileAsBlob} from "../../../api/base.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Explore from "../../../components/explore/explore/Explore.jsx";

const {Paragraph} = Typography;

interface CodeViewProps {
  datasource: string;
  model?: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({datasource, model}) => {
  const [blob, setBlob] = React.useState<Blob | null>(null);
  const [exploreOpen, setExploreOpen] = React.useState(false);

  // const Explore = lazy(() => import('../../../components/explore/explore/Explore.jsx'))
  return (
    <>
      <div>
        {model?.name} {model?.comment}
      </div>
      <Divider/>
      <pre>
        <Paragraph copyable style={{whiteSpace: "pre-wrap"}}>{model?.idl}</Paragraph>
      </pre>
      <Space>
        <Button type="primary" onClick={() => {
          navigator.clipboard.writeText(model?.idl || '');
          message.success('Copied');
        }}>
          Copy IDL
        </Button>
        <Button type="primary" onClick={async () => {
          const blob = await getFileAsBlob(`${BASE_URI}/codegen/${datasource}_${model?.name}.zip`);
          setBlob(blob);
          setExploreOpen(true);
        }}>
          Explore
        </Button>

        <Button type="primary" onClick={async () => {
          const url: string = `${BASE_URI}/codegen/${datasource}_${model?.name}.zip`;
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `${datasource}_${model?.name}.zip`); // 替换为你希望保存的文件名
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }}>
          Generate code
        </Button>
      </Space>
      <Explore
        projectName={`${datasource}_${model?.name}.zip`}
        blob={blob}
        open={exploreOpen}
        onClose={() => {
          setBlob(null);
          setExploreOpen(false);
        }}
      />
    </>
  );
};

export default CodeView;
