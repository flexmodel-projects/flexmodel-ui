import React, {useEffect, useRef, useState} from "react";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Descriptions,
  Drawer,
  FloatButton,
  Form,
  Input,
  Row,
  Select,
  Space,
  Table,
  Tag
} from "antd";
import {DownOutlined, ReloadOutlined, SearchOutlined, SettingOutlined, UpOutlined} from "@ant-design/icons";
import * as echarts from "echarts";
import {getApiLogs, getApiLogStat} from "../../api/api-log.ts";
import {css} from "@emotion/css";
import LogSettings from "./components/LogSettings.tsx";
import {useTranslation} from "react-i18next";

const {RangePicker} = DatePicker;
const LogViewer: React.FC = () => {
  const {t} = useTranslation();
  const [isOver, setIsOver] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any[]>([]);
  const [index, setIndex] = useState<number>(1);
  const [log, setLog] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const logStatRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [expand, setExpand] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [settingsDialogVisible, setSettingsDialogVisible] = useState<boolean>(false);

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
      axisLabel: {
        formatter: function (value: string) {
          const date = new Date(value);
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date
            .getHours()
            .toString()
            .padStart(2, '0')}:${date
            .getMinutes()
            .toString()
            .padStart(2, '0')}`;
        }
      },
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
    const filter = form.getFieldsValue();
    const res: any[] = await getApiLogs(index, 50, getFilterQuery(filter));
    if (res.length === 0) {
      setIsOver(true);
    }
    setTableData(res);
  };

  const fetchApiLogStat = async () => {
    const filter = form.getFieldsValue();
    const statList: any[] = await getApiLogStat(getFilterQuery(filter));
    option.xAxis.data = statList.map((stat) => stat.date);
    option.series[0].data = statList.map((stat) => stat.total);
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }
  };

  const getFilterQuery = (filter: any) => {
    return {
      keyword: filter?.keyword,
      level: filter?.level?.join(","),
      dateRange: filter?.dateRange?.map((date: any) => date?.format('YYYY-MM-DD HH:mm:ss'))?.join(","),
    };
  }

  const initializeChart = () => {
    if (logStatRef.current) {
      chartInstance.current = echarts.init(logStatRef.current);
      fetchApiLogStat();
    }
  };

  useEffect(() => {
    fetchApiLogs();
    initializeChart();
    // 在窗口大小变化时更新图表大小
    const resizeChart = () => chartInstance.current?.resize();
    window.addEventListener("resize", resizeChart);
    return () => {
      window.removeEventListener("resize", resizeChart);
      // 销毁图表实例
      chartInstance.current?.dispose();
      chartInstance.current = null;
    };
  }, []);

  const showDetail = (record: any) => {
    setLog(record);
    setDrawerVisible(true);
  };

  const loadMore = async () => {
    setIsLoading(true);
    const res: any[] = await getApiLogs(index + 1, 50, getFilterQuery(form.getFieldsValue()));
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
    fetchApiLogStat();
  };
  const searchLog = async () => {
    setIsLoading(true);
    setIndex(1);
    await fetchApiLogs();
    fetchApiLogStat();
    setIsLoading(false);
  };

  const resetLog = async () => {
    setIndex(1);
    form.resetFields();
    await fetchApiLogs();
  };

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
    <>
      <Card bordered={false}>
        <Row justify="space-between" align="middle">
          <Col span={4}>
            <span>{t('logs')}</span>
          </Col>
          <Col span={20} style={{textAlign: "right"}}>
            <Space>
              <Button icon={<SettingOutlined/>} onClick={() => setSettingsDialogVisible(true)}/>
              <Button
                icon={<ReloadOutlined/>}
                onClick={refreshLog}
                loading={isLoading}
              />
            </Space>
          </Col>
        </Row>
        <Row style={{margin: "16px 0"}}>
          <Col style={{paddingTop: '20px'}} span={24}>
            <Form form={form}>
              {expand &&
                <Row>
                  <Col span={6}>
                    <Form.Item name="level" label={t('level')}>
                      <Select style={{width: '150px'}} mode="multiple" placeholder={t('select_your_log_level')}
                              allowClear>
                        <Select.Option value="DEBUG">Debug</Select.Option>
                        <Select.Option value="INFO">Info</Select.Option>
                        <Select.Option value="WARN">Warn</Select.Option>
                        <Select.Option value="ERROR">Error</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="dateRange" label={t('date_range')}>
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    </Form.Item>
                  </Col>
                </Row>}
              <Row>
                <Col span={19}>
                  <Form.Item name="keyword" style={{width: '100%'}} label={t('search_keywords')}>
                    <Input
                      placeholder={t('search_keywords')}
                    />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Space style={{paddingLeft: '10px'}}>
                      <Button icon={<SearchOutlined/>} type="primary" onClick={searchLog}>{t('search')}</Button>
                      <Button type="default" onClick={resetLog}>{t('reset')}</Button>
                      <a
                        onClick={() => {
                          setExpand(!expand);
                        }}
                      >
                        {expand ? (
                          <>
                            {t('collapse')} <UpOutlined/>
                          </>
                        ) : (
                          <>
                            {t('expand')}
                            <DownOutlined/>
                          </>
                        )}
                      </a>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>

            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div id="logStat" ref={logStatRef} style={{width: "100%", height: "120px"}}/>
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
            <Button onClick={loadMore} loading={isLoading}>
              {t('load_more')}
            </Button>
          )}
        </Row>
        <FloatButton.BackTop/>
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
      <LogSettings visible={settingsDialogVisible}
                   onConfirm={() => setSettingsDialogVisible(false)}
                   onCancel={() => setSettingsDialogVisible(false)}/>
    </>
  );
};

export default LogViewer;
