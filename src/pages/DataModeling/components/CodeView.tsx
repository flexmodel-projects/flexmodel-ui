import React, {useEffect, useState} from "react";
import type {Model} from "../data";
import {Button, Col, Divider, Dropdown, Menu, Row, Spin, Typography} from 'antd';
import {BASE_URI, getFileAsBlob} from "../../../api/base.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Explore from "../../../components/explore/explore/Explore.jsx";
import {CodeOutlined} from "@ant-design/icons";


interface CodeViewProps {
  datasource: string;
  model: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({datasource, model}) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      if (model) {
        getFileAsBlob(`${BASE_URI}/codegen/${datasource}_${model?.name}.zip`).then(blob => {
          setBlob(blob);
          setLoading(false);
        });
      }
    }, [datasource]
  )

  // const Explore = lazy(() => import('../../../components/explore/explore/Explore.jsx'))
  return (
    <div style={{padding: '20px'}}>
      <Row justify="space-between">
        <Col>
          {model.name} {model.comment}
          <Dropdown overlay={
            <Menu>
              <p>IDL Info:</p>
              <p>---</p>
              <Typography.Paragraph copyable style={{whiteSpace: "pre-wrap"}}>{model?.idl}</Typography.Paragraph>
            </Menu>
          } arrow>
            <Button type="text" icon={<CodeOutlined/>}/>
          </Dropdown>
        </Col>
        <Col>
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
        </Col>
      </Row>
      <Divider/>
      <Spin size="large" spinning={loading}>
        <Explore
          projectName={`${datasource}_${model?.name}.zip`}
          blob={blob}
        />
      </Spin>
    </div>
  );
};

export default CodeView;
