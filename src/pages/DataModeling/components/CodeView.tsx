import React, {useEffect, useRef, useState} from "react";
import type {Model} from "../data";
import {Button, Col, Divider, Dropdown, Menu, Row, Spin, Typography} from 'antd';
import {BASE_URI, getFileAsBlob} from "../../../api/base.ts";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import Explore from "../../../components/explore/explore/Explore.jsx";
import {CodeOutlined, DownloadOutlined} from "@ant-design/icons";


interface CodeViewProps {
  datasource: string;
  model: Partial<Model>;
}

const CodeView: React.FC<CodeViewProps> = ({datasource, model}) => {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(true);
  const exploreRef = useRef();

  const downloadZip = () => {
    // @ts-ignore
    exploreRef?.current?.downloadZip();
  }

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
          <Button type="primary" icon={<DownloadOutlined />} onClick={() => downloadZip()}>
            下载源码包
          </Button>
        </Col>
      </Row>
      <Divider/>
      <Spin spinning={loading}>
        <Explore
          ref={exploreRef}
          projectName={`${datasource}_${model?.name}.zip`}
          blob={blob}
        />
      </Spin>
    </div>
  );
};

export default CodeView;
