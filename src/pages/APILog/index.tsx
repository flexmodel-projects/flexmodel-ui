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
import {css} from "@emotion/css";
import LogSettings from "./components/LogSettings.tsx";
import {useTranslation} from "react-i18next";

const {RangePicker} = DatePicker;
const LogViewer: React.FC = () => {
  const {t} = useTranslation();
  const [tableData, setTableData] = useState<any>({list: [], total: 0});
  const [log, setLog] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const logStatRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const [expand, setExpand] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [query, setQuery] = useState({current: 1, pageSize: 100});
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

  const fetchApiLogs = async () => {
    const filter = form.getFieldsValue();
    const res: any[] = await getApiLogs(getFilterQuery(filter));
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
      ...query,
      keyword: filter?.keyword,
      isSuccess: filter?.isSuccess,
      dateRange: filter?.dateRange
        ?.map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
        ?.join(","),
    };
  };

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

  useEffect(() => {
    fetchApiLogs();
  }, [query]);

  const showDetail = (record: any) => {
    setLog(record);
    setDrawerVisible(true);
  };

  const searchLog = async () => {
    setQuery({current: 1, pageSize: 100});
    await fetchApiLogs();
    await fetchApiLogStat();
  };

  const resetLog = async () => {
    form.resetFields();
    setQuery({current: 1, pageSize: 100});
    await fetchApiLogs();
  };

  const columns = [
    {
      title: t("is_success"),
      dataIndex: "isSuccess",
      width: 100,
      render: (isSuccess: boolean) => {
        let color = "blue";
        if (!isSuccess) color = "red";
        return <Tag color={color}>{isSuccess ? "YES" : "NO"}</Tag>;
      },
    },
    {
      title: t("message"),
      dataIndex: "path",
      render: (_: string, record: any) => (
        <Row style={{fontSize: "12px", padding: "10px 0"}}>
          <Col span={24}>{record.path}</Col>
          <Col>
            <div style={{display: "flex", gap: "8px"}}>
              <Tag color="blue">status: {record?.statusCode}</Tag>
              <Tag color="blue">time: {record?.responseTime}ms</Tag>
              {record?.ipAddress && (
                <Tag color="blue">ipAddress: {record?.ipAddress}</Tag>
              )}
              {record?.statusCode >= 500 ? (
                <Tag color="red">message: {record?.errorMessage}</Tag>
              ) : record?.data?.status >= 400 ? (
                <Tag color="orange">message: {record?.errorMessage}</Tag>
              ) : null}
            </div>
          </Col>
        </Row>
      ),
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      width: 250,
    },
  ];

  return (
    <>
      <Card
        bordered={false}
        className="h-full"
        styles={{body: {height: "100%"}}}
      >
        <Row justify="space-between" align="middle">
          <Col span={4}>
            <span style={{fontWeight: "bold", fontSize: "16px"}}>
              {t("logs")}
            </span>
          </Col>
          <Col span={20} style={{textAlign: "right"}}>
            <Space>
              <Button
                icon={<SettingOutlined/>}
                onClick={() => setSettingsDialogVisible(true)}
              />
            </Space>
          </Col>
        </Row>
        <Row style={{margin: "12px 0"}}>
          <Col style={{paddingTop: "10px"}} span={24}>
            <Form form={form}>
              {expand && (
                <Row>
                  <Col span={6}>
                    <Form.Item name="isSuccess" label={t("is_success")}>
                      <Select
                        style={{width: "150px"}}
                        placeholder={t("is_success_tips")}
                        allowClear
                      >
                        <Select.Option value="true">Yes</Select.Option>
                        <Select.Option value="false">No</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={18}>
                    <Form.Item name="dateRange" label={t("date_range")}>
                      <RangePicker showTime format="YYYY-MM-DD HH:mm:ss"/>
                    </Form.Item>
                  </Col>
                </Row>
              )}
              <Row>
                <Col span={19}>
                  <Form.Item
                    name="keyword"
                    style={{width: "100%"}}
                    label={t("search_keywords")}
                  >
                    <Input placeholder={t("search_keywords")}/>
                  </Form.Item>
                </Col>
                <Col span={5}>
                  <Form.Item>
                    <Space style={{paddingLeft: "10px"}}>
                      <Button
                        icon={<SearchOutlined/>}
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
                            {t("collapse")} <UpOutlined/>
                          </>
                        ) : (
                          <>
                            {t("expand")}
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
            <div
              id="logStat"
              ref={logStatRef}
              style={{width: "100%", height: "100px"}}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              bordered={false}
              virtual
              scroll={{y: expand ? 270 : 325}}
              size="small"
              columns={columns}
              dataSource={tableData?.list}
              rowKey="id"
              rowClassName={css`
                cursor: pointer;
              `}
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
              setQuery({...query, current: page, pageSize})
            }
            style={{marginTop: 16}}
          />
        </Row>
        <FloatButton.BackTop/>
        <Drawer
          title="Request log"
          width={680}
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
        >
          <Descriptions column={1} bordered>
            {Object.keys(log).map((key) => {
              const value = log[key] instanceof Object ? (JSON.stringify(log[key])) : log[key] + "";
              return (
                <Descriptions.Item key={key} label={key}>
                  {value}
                </Descriptions.Item>
              )
            })}
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
