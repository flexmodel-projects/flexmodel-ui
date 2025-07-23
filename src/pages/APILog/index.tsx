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
  Pagination,
  Row,
  Select,
  Space,
  Table,
  Tag,
} from "antd";
import {DownOutlined, SearchOutlined, SettingOutlined, UpOutlined,} from "@ant-design/icons";
import * as echarts from "echarts";
import {getApiLogs, getApiLogStat} from "../../api/api-log.ts";
import LogSettings from "./components/LogSettings.tsx";
import {useTranslation} from "react-i18next";

const { RangePicker } = DatePicker;
const LogViewer: React.FC = () => {
  const { t } = useTranslation();
  const [tableData, setTableData] = useState<any>({ list: [], total: 0 });
  const [log, setLog] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const logStatRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [expand, setExpand] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [query, setQuery] = useState({ current: 1, pageSize: 100 });
  const [settingsDialogVisible, setSettingsDialogVisible] =
    useState<boolean>(false);

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
            .padStart(2, "0")}-${date
            .getDate()
            .toString()
            .padStart(2, "0")} ${date
            .getHours()
            .toString()
            .padStart(2, "0")}:${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
        },
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

  const getApiLogsHandler = async () => {
    const filter = form.getFieldsValue();
    const res: any[] = await getApiLogs(getFilterQuery(filter));
    setTableData(res);
  };

  const getApiLogStatHandler = async () => {
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
      ...query,
      keyword: filter?.keyword,
      isSuccess:
        filter?.isSuccess === undefined || filter?.isSuccess === null
          ? undefined
          : filter?.isSuccess === true || filter?.isSuccess === "true"
          ? true
          : false,
      dateRange: filter?.dateRange
        ?.map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
        ?.join(","),
    };
  };

  const initializeChart = () => {
    if (logStatRef.current) {
      chartInstance.current = echarts.init(logStatRef.current);
      getApiLogStatHandler();
    }
  };

  useEffect(() => {
    getApiLogsHandler();
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

  useEffect(() => {
    getApiLogsHandler();
  }, [query]);

  const showDetail = (record: any) => {
    setLog(record);
    setDrawerVisible(true);
  };

  const searchLog = async () => {
    setQuery({ current: 1, pageSize: 100 });
    await getApiLogsHandler();
    await getApiLogStatHandler();
  };

  const resetLog = async () => {
    form.resetFields();
    setQuery({ current: 1, pageSize: 100 });
    await getApiLogsHandler();
  };

  const columns = [
    {
      title: t("id"),
      dataIndex: "id",
      width: 120,
      ellipsis: true,
    },
    {
      title: t("http_method"),
      dataIndex: "httpMethod",
      width: 100,
      render: (method: string) => <Tag color="blue">{method}</Tag>,
    },
    {
      title: t("path"),
      dataIndex: "path",
      width: 200,
      ellipsis: true,
    },
    {
      title: t("status_code"),
      dataIndex: "statusCode",
      width: 100,
      render: (code: number) => {
        const color = code >= 500 ? "red" : code >= 400 ? "orange" : "green";
        return <Tag color={color}>{code}</Tag>;
      },
    },
    {
      title: t("response_time"),
      dataIndex: "responseTime",
      width: 120,
      render: (time: number) => <span>{time}ms</span>,
    },
    {
      title: t("client_ip"),
      dataIndex: "clientIp",
      width: 120,
      ellipsis: true,
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      width: 180,
    },
    {
      title: t("is_success"),
      dataIndex: "isSuccess",
      width: 100,
      render: (success: boolean) => success ? <Tag color="green">Success</Tag> : <Tag color="red">Fail</Tag>,
    },
    {
      title: t("error_message"),
      dataIndex: "errorMessage",
      width: 200,
      ellipsis: true,
      render: (msg: string) => msg ? <span style={{color: 'red'}}>{msg}</span> : null,
    },
  ];

  return (
    <>
      <Card
        bordered={false}
        className="h-full"
        styles={{ body: { height: "100%" } }}
      >
        <Row justify="space-between" align="middle">
          <Col span={4}>
            <span style={{ fontWeight: "bold", fontSize: "16px" }}>
              {t("logs")}
            </span>
          </Col>
          <Col span={20} style={{ textAlign: "right" }}>
            <Space>
              <Button
                icon={<SettingOutlined />}
                onClick={() => setSettingsDialogVisible(true)}
              />
            </Space>
          </Col>
        </Row>
        <Row style={{ margin: "12px 0" }}>
          <Col style={{ paddingTop: "10px" }} span={24}>
            <Form form={form}>
              {expand && (
                <Row>
                  <Col span={6}>
                    <Form.Item name="isSuccess" label={t("is_success")}>
                      <Select style={{ width: "150px" }} allowClear>
                        <Select.Option value={true}>{t("success")}</Select.Option>
                        <Select.Option value={false}>{t("fail")}</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="dateRange" label={t("date_range")}>
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={19}>
                  <Form.Item
                    name="keyword"
                    style={{ width: "100%" }}
                    label={t("search_keywords")}
                  >
                    <Input placeholder={t("search_keywords")} />
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Space style={{ paddingLeft: "10px" }}>
                      <Button
                        icon={<SearchOutlined />}
                        type="primary"
                        onClick={searchLog}
                      >
                        {t("search")}
                      </Button>
                      <Button type="default" onClick={resetLog}>
                        {t("reset")}
                      </Button>
                      <a
                        onClick={() => {
                          setExpand(!expand);
                        }}
                      >
                        {expand ? (
                          <>
                            {t("collapse")} <UpOutlined />
                          </>
                        ) : (
                          <>
                            {t("expand")}
                            <DownOutlined />
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
            <div
              id="logStat"
              ref={logStatRef}
              style={{ width: "100%", height: "100px" }}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered={false}
              virtual
              scroll={{ y: expand ? 270 : 325 }}
              size="small"
              columns={columns}
              dataSource={tableData?.list}
              rowKey="id"
              rowClassName={() => "cursor-pointer"}
              onRow={(record) => ({
                onClick: () => showDetail(record),
              })}
              pagination={false}
            />
          </Col>
        </Row>
        <Row justify="end">
          <Pagination
            align="end"
            current={query.current}
            pageSize={query.pageSize}
            total={tableData.total}
            showTotal={(total, range) =>
              t("pagination_total_text", {
                start: range[0],
                end: range[1],
                total: total,
              })
            }
            onChange={(page, pageSize) =>
              setQuery({ ...query, current: page, pageSize })
            }
            style={{ marginTop: 16 }}
          />
        </Row>
        <FloatButton.BackTop />
        <Drawer
          title={t("request_log")}
          width={680}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Descriptions column={1} bordered>
            <Descriptions.Item label="id">{log.id}</Descriptions.Item>
            <Descriptions.Item label="url">{log.url}</Descriptions.Item>
            <Descriptions.Item label="httpMethod">{log.httpMethod}</Descriptions.Item>
            <Descriptions.Item label="path">{log.path}</Descriptions.Item>
            <Descriptions.Item label="requestBody">{log.requestBody}</Descriptions.Item>
            <Descriptions.Item label="requestHeaders">{log.requestHeaders ? JSON.stringify(log.requestHeaders) : null}</Descriptions.Item>
            <Descriptions.Item label="statusCode">{log.statusCode}</Descriptions.Item>
            <Descriptions.Item label="responseTime">{log.responseTime}ms</Descriptions.Item>
            <Descriptions.Item label="clientIp">{log.clientIp}</Descriptions.Item>
            <Descriptions.Item label="createdAt">{log.createdAt}</Descriptions.Item>
            <Descriptions.Item label="isSuccess">{log.isSuccess ? t("yes") : t("no")}</Descriptions.Item>
            <Descriptions.Item label="errorMessage">{log.errorMessage}</Descriptions.Item>
          </Descriptions>
        </Drawer>
      </Card>
      <LogSettings
        visible={settingsDialogVisible}
        onConfirm={() => setSettingsDialogVisible(false)}
        onCancel={() => setSettingsDialogVisible(false)}
      />
    </>
  );
};

export default LogViewer;
