import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, DatePicker, List, Row, Space, Spin, Statistic} from "antd";
import ReactECharts from "echarts-for-react";
import dayjs, {Dayjs} from "dayjs";
import Title from "antd/lib/typography/Title";
import {DatabaseTwoTone, FlagTwoTone, HourglassTwoTone, RocketTwoTone} from "@ant-design/icons";
import {getOverview} from "../../services/overview.ts";
import {useTranslation} from "react-i18next";
import styles from "./index.module.scss";

const { RangePicker } = DatePicker;

// 统计数据类型
interface Statistics {
  queryCount: number;
  mutationCount: number;
  subscribeCount: number;
  dataSourceCount: number;
}

// 接口访问排名
interface RankingData {
  name: string;
  total: number;
}

// 趋势图数据
interface ApiStat {
  dateList: string[];
  successData: number[];
  failData: number[];
}

// 接口返回类型
interface OverviewResponse extends Statistics {
  apiRankingList: RankingData[];
  apiStat: ApiStat;
}

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<Statistics>({
    queryCount: 0,
    mutationCount: 0,
    subscribeCount: 0,
    dataSourceCount: 0,
  });
  const [apiStat, setApiStat] = useState<ApiStat>({
    dateList: [],
    successData: [],
    failData: [],
  });
  const [rankingData, setRankingData] = useState<RankingData[]>([]);

  // 默认日期范围设置为本周
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    dayjs().startOf("week"),
    dayjs().endOf("week"),
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data: OverviewResponse = await getOverview({
        dateRange: dateRange
          .map((date: any) => date?.format("YYYY-MM-DD HH:mm:ss"))
          ?.join(","),
      });
      setLoading(false);
      setStats({
        queryCount: data.queryCount,
        mutationCount: data.mutationCount,
        subscribeCount: data.subscribeCount,
        dataSourceCount: data.dataSourceCount,
      });
      setApiStat(data.apiStat);
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
    tooltip: { trigger: "axis" },
    legend: { data: [t("success"), t("fail")] },
    grid: { top: "3%", left: "3%", right: "3%", containLabel: true },
    xAxis: { type: "category", data: apiStat.dateList },
    yAxis: { type: "value" },
    series: [
      {
        name: t("success"),
        type: "line",
        data: apiStat.successData,
        itemStyle: { color: "#52c41a" },
      },
      {
        name: t("fail"),
        type: "line",
        data: apiStat.failData,
        itemStyle: { color: "#ff4d4f" },
      },
    ],
  };

  return (
    <div
      style={{ flex: 1, width: "100%", display: "flex" }}
      className={styles.root}
    >
      <Spin spinning={loading}>
        <Row gutter={12}>
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
        <Row style={{ marginTop: 10, flex: 1 }} gutter={16}>
          <Col span={24}>
            <Card
              className="flex flex-1 h-full flex-col overflow-hidden"
              title={t("trend_analysis")}
              extra={
                <Space>
                  <Button onClick={() => handleQuickSelect("today")} type="text">
                    {t("today")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("week")} type="text">
                    {t("week")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("month")} type="text">
                    {t("month")}
                  </Button>
                  <Button onClick={() => handleQuickSelect("year")} type="text">
                    {t("year")}
                  </Button>
                  <RangePicker value={dateRange} onChange={handleDateChange} />
                </Space>
              }
            >
              <Row gutter={16} className="h-full">
                <Col span={18}>
                  <ReactECharts option={chartConfig} style={{ height: "100%" }} />
                </Col>
                <Col span={6} className="flex flex-col">
                  <Title level={5}>{t("api_ranking")}</Title>
                  <List
                    style={{ overflowY: "scroll", maxHeight: "56vh" }}
                    className="flex flex-1 relative"
                    dataSource={rankingData}
                    renderItem={(item, index) => (
                      <List.Item style={{ padding: "10px 16px" }}>
                        <div className="flex w-full justify-between">
                          <Space className="overflow-hidden w-60">
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

