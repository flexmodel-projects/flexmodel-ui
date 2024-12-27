import React, { useEffect, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  DatePicker,
  List,
  Row,
  Space,
  Spin,
  Statistic,
} from "antd";
import ReactECharts from "echarts-for-react";
import dayjs, { Dayjs } from "dayjs";
import Title from "antd/lib/typography/Title";
import {
  DatabaseTwoTone,
  FlagTwoTone,
  HourglassTwoTone,
  RocketTwoTone,
} from "@ant-design/icons";
import { fetchOverview } from "../../api/overview.ts";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const { RangePicker } = DatePicker;

// 定义统计数据类型
interface Statistics {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  dataSourceCount: number;
}

// 定义图表数据类型
interface ChartData {
  date: string;
  total: number;
}

// 定义接口访问排名数据类型
interface RankingData {
  name: string;
  total: number;
}

// 主页面组件
const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Statistics>({
    queryCount: 0,
    mutationCount: 0,
    subscribeCount: 0,
    dataSourceCount: 0,
  });
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  // 默认日期范围设置为本周
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("week"),
    dayjs().endOf("week"),
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchOverview({
        dateRange: dateRange
          .map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
          ?.join(","),
      });
      setLoading(false);
      setStats(data as Statistics);
      setChartData(data.apiStatList);
      setRankingData(data.apiRankingList);
    };
    loadData();
  }, [dateRange]);

  const handleDateChange = (dates: [any, any] | null) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  const handleQuickSelect = (type: "today" | "week" | "month" | "year") => {
    let start: Dayjs, end: Dayjs;

    const now = dayjs();
    switch (type) {
      case "today":
        start = now.startOf("day");
        end = now.endOf("day");
        break;
      case "week":
        start = now.startOf("week");
        end = now.endOf("week");
        break;
      case "month":
        start = now.startOf("month");
        end = now.endOf("month");
        break;
      case "year":
        start = now.startOf("year");
        end = now.endOf("year");
        break;
      default:
        start = now.startOf("day");
        end = now.endOf("day");
    }

    setDateRange([start, end]);
  };

  // ECharts 配置
  const chartConfig = {
    tooltip: {
      trigger: "axis",
    },
    grid: {
      top: "3%",
      left: "3%",
      right: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: chartData.map((item) => item.date),
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: "Total Requests",
        type: "line",
        data: chartData.map((item) => item.total),
      },
    ],
  };

  return (
    <div
      style={{ flex: 1, width: "100%", display: "flex" }}
      className={styles.root}
    >
      <Spin spinning={false}>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <Statistic
                title={t("query")}
                value={stats.queryCount}
                prefix={<HourglassTwoTone />}
                precision={0}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title={t("mutation")}
                value={stats.mutationCount}
                prefix={<FlagTwoTone />}
                precision={0}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title={t("subscription")}
                value={stats.subscribeCount}
                prefix={<RocketTwoTone />}
                precision={0}
              />
            </Card>
          </Col>

          <Col span={6}>
            <Card>
              <Statistic
                title={t("datasource")}
                value={stats.dataSourceCount}
                prefix={<DatabaseTwoTone />}
                precision={0}
              />
            </Card>
          </Col>
        </Row>
        <Row style={{ marginTop: 16, flex: 1 }} gutter={16}>
          <Col span={24}>
            <Card
              style={{
                flex: 1,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              title={t("trend_analysis")}
              extra={
                <Space>
                  <Button
                    onClick={() => handleQuickSelect("today")}
                    type="text"
                  >
                    {t("today")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("week")} type="text">
                    {t("week")}
                  </Button>
                  <Button
                    onClick={() => handleQuickSelect("month")}
                    type="text"
                  >
                    {t("month")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("year")} type="text">
                    {t("year")}
                  </Button>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateChange}
                    style={{ marginRight: 8 }}
                  />
                </Space>
              }
            >
              <Row gutter={16} style={{ height: "100%" }}>
                <Col span={18}>
                  <ReactECharts
                    option={chartConfig}
                    style={{ height: "100%" }}
                  />
                </Col>
                <Col span={6}>
                  <Title level={5}>{t("api_ranking")}</Title>
                  <List
                    style={{ overflowY: "scroll", height: 280 }}
                    dataSource={rankingData}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: "10px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <Space style={{ overflow: "hidden" }}>
                            <Badge count={index + 1} showZero color="green" />{" "}
                            {item.name}
                          </Space>
                          <span>{item.total}</span>
                        </div>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
export default StatisticsPage;
