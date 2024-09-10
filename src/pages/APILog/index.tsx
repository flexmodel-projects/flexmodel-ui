import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Descriptions, Drawer, Input, Row, Space, Table, Tag} from "antd";
import {ReloadOutlined, SearchOutlined, SettingOutlined} from "@ant-design/icons";
import * as echarts from "echarts";
import {getApiLogs, getApiLogStat} from "../../api/api-log.ts";
import {css} from "@emotion/css"; // 替换为你的API导入路径
import { FloatButton } from 'antd';

const LogViewer: React.FC = () => {
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(1);
  const [log, setLog] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [filter, setFilter] = useState<string>("");
  const logStatRef = useRef<HTMLDivElement>(null);

  const option: any = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: [],
    },
    yAxis: {
      splitNumber: 2,
      type: "value",
    },
    series: [
      {
        name: "Total requests",
        type: "line",
        stack: "Total",
        data: [],
      },
    ],
  };

  const fetchApiLogs = async () => {
    const res: any[] = await getApiLogs(index, 50, filter);
    if (res.length === 0) {
      setIsOver(true);
    }
    setTableData(res);
  };

  const fetchApiLogStat = async () => {
    const statList: any[] = await getApiLogStat(filter);
    option.xAxis.data = statList.map((stat) => stat.date);
    option.series[0].data = statList.map((stat) => stat.total);
    const myChart = echarts.init(logStatRef.current!);
    myChart.setOption(option);
  };

  const showDetail = (record: any) => {
    setLog(record);
    setDrawerVisible(true);
  };

  const loadMore = async () => {
    setIsLoading(true);
    const res: any[] = await getApiLogs(index + 1);
    setIsLoading(false);
    setIsOver(res.length < 50);
    if (res.length !== 0) {
      setTableData((prevData) => [...prevData, ...res]);
      setIndex((prevIndex) => prevIndex + 1);
    }
  };

  const refreshLog = async () => {
    setIsLoading(true);
    setIndex(1);
    const res: any[] = await getApiLogs(1);
    setIsLoading(false);
    if (res.length === 0) {
      setIsOver(true);
    }
    setTableData(res);
    await fetchApiLogStat();
  };

  useEffect(() => {
    fetchApiLogs();
    fetchApiLogStat();
  }, [filter]);

  const columns = [
    {
      title: "Level",
      dataIndex: "level",
      width: 100,
      render: (level: string) => {
        let color = "blue";
        if (level === "ERROR") color = "red";
        else if (level === "WARN") color = "orange";
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: "Message",
      dataIndex: "uri",
      render: (uri: string, record: any) => (
        <Row style={{fontSize: "12px", padding: "10px 0"}}>
          <Col span={24}>{uri}</Col>
          <Col>
            <div style={{display: "flex", gap: "8px"}}>
              <Tag color="blue">status: {record?.data?.status}</Tag>
              <Tag color="blue">execTime: {record?.data?.execTime}ms</Tag>
              {record?.data?.remoteIp && <Tag color="blue">remoteIp: {record?.data?.remoteIp}</Tag>}
              {record?.data?.status >= 500 ? (
                <Tag color="red">message: {record?.data?.message}</Tag>
              ) : record?.data?.status >= 400 ? (
                <Tag color="orange">message: {record?.data?.message}</Tag>
              ) : null}
            </div>
          </Col>
        </Row>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      width: 200,
    },
  ];

  return (
    <Card bordered={false}>
      <Row justify="space-between" align="middle">
        <Col span={4}>
          <span>Logs</span>
        </Col>
        <Col span={20} style={{textAlign: "right"}}>
          <Space>
            <Button icon={<SettingOutlined/>}/>
            <Button
              icon={<ReloadOutlined/>}
              onClick={refreshLog}
              loading={isLoading}
            />
          </Space>
        </Col>
      </Row>
      <Row style={{margin: "16px 0"}}>
        <Col span={24}>
          <Input
            size="large"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search keywords"
            prefix={<SearchOutlined/>}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <div id="logStat" ref={logStatRef} style={{width: "100%", height: "300px"}}/>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table
            size="small"
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            rowClassName={css`cursor: pointer`}
            onRow={(record) => ({
              onClick: () => showDetail(record),
            })}
            pagination={false}
          />
        </Col>
      </Row>
      <Row justify="center" style={{marginTop: "16px"}}>
        {!isOver && (
          <Button size="large" onClick={loadMore} loading={isLoading}>
            Load more
          </Button>
        )}
      </Row>
      <FloatButton.BackTop />
      <Drawer
        title="Request log"
        width={680}
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
      >
        <Descriptions column={1} bordered>
          <Descriptions.Item label="id">{log.id}</Descriptions.Item>
          <Descriptions.Item label="level">{log.level}</Descriptions.Item>
          <Descriptions.Item label="createdAt">{log.createdAt}</Descriptions.Item>
          <Descriptions.Item label="data.execTime">{log?.data?.execTime}ms</Descriptions.Item>
          <Descriptions.Item label="data.status">{log?.data?.status}</Descriptions.Item>
          <Descriptions.Item label="data.message">{log?.data?.message}</Descriptions.Item>
          <Descriptions.Item label="data.errors">{log?.data?.errors}</Descriptions.Item>
          <Descriptions.Item label="data.method">{log?.data?.method}</Descriptions.Item>
          <Descriptions.Item label="data.path">{log?.data?.path}</Descriptions.Item>
          <Descriptions.Item label="data.userAgent">{log?.data?.userAgent}</Descriptions.Item>
          <Descriptions.Item label="data.remoteIp">{log?.data?.remoteIp}</Descriptions.Item>
          <Descriptions.Item label="data.referer">{log?.data?.referer}</Descriptions.Item>
        </Descriptions>
      </Drawer>
    </Card>
  );
};

export default LogViewer;
