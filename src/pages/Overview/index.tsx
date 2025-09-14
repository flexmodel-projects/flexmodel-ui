import React, {useEffect, useState} from "react";
import {Badge, Button, Card, Col, DatePicker, List, Row, Space, Spin, theme} from "antd";
import ReactECharts from "echarts-for-react";
import dayjs, {Dayjs} from "dayjs";
import {DatabaseOutlined, FlagOutlined, HourglassOutlined, RocketOutlined} from "@ant-design/icons";
import {getOverview} from "@/services/overview.ts";
import {useTranslation} from "react-i18next";
import styles from "@/pages/Overview/index.module.scss";
import type {ApiStat, OverviewResponse, RankingData, Statistics} from '@/types/overview.d.ts';
import SystemMonitoring from './components/monitoring';

const { RangePicker } = DatePicker;

// 自定义统计卡片组件
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card className={styles.statCardWrapper}>
      <div className={styles.statCard}>
        <div className={styles.statIcon} style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className={styles.statContent}>
          <div className={styles.statTitle}>{title}</div>
          <div className={styles.statValue}>{value}</div>
        </div>
      </div>
    </Card>
  );
};

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
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

  // 添加选中状态管理
  const [selectedQuickSelect, setSelectedQuickSelect] = useState<"today" | "week" | "month" | "year" | "custom">("week");


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
      if (data.apiStat) setApiStat(data.apiStat);
      if (data.apiRankingList) setRankingData(data.apiRankingList);
    };
    loadData();
  }, [dateRange]);

  const handleDateChange = (dates: [any, any] | null) => {
    if (dates) {
      setDateRange(dates);
      setSelectedQuickSelect("custom"); // 当用户手动选择日期时，设置为自定义状态
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
    setSelectedQuickSelect(type); // 设置选中状态
  };

  // ECharts 配置 - 使用 Ant Design token
  const chartConfig = {
    backgroundColor: 'transparent',
    textStyle: {
      color: token.colorText,
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: {
        color: token.colorText,
      },
    },
    legend: {
      data: [t("success"), t("fail")],
      textStyle: {
        color: token.colorText,
      },
    },
    grid: {
      top: "3%",
      left: "3%",
      right: "3%",
      containLabel: true,
      borderColor: token.colorBorder,
    },
    xAxis: {
      type: "category",
      data: apiStat.dateList,
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: token.colorText,
      },
    },
    yAxis: {
      type: "value",
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: token.colorText,
      },
      splitLine: {
        lineStyle: {
          color: token.colorBorderSecondary,
        },
      },
    },
    series: [
      {
        name: t("success"),
        type: "line",
        data: apiStat.successData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorSuccess
        },
        itemStyle: {
          color: token.colorSuccess
        },
        areaStyle: {
          color: token.colorSuccess + '20'
        }
      },
      {
        name: t("fail"),
        type: "line",
        data: apiStat.failData,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorError
        },
        itemStyle: {
          color: token.colorError
        },
        areaStyle: {
          color: token.colorError + '20'
        }
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
            <StatCard
              title={t("query")}
              value={stats.queryCount}
              icon={<HourglassOutlined style={{ fontSize: '24px', color: token.colorPrimary }} />}
              color={token.colorPrimaryBg}
            />
          </Col>
          <Col span={6}>
            <StatCard
              title={t("mutation")}
              value={stats.mutationCount}
              icon={<FlagOutlined style={{ fontSize: '24px', color: token.colorSuccess }} />}
              color={token.colorSuccessBg}
            />
          </Col>
          <Col span={6}>
            <StatCard
              title={t("subscription")}
              value={stats.subscribeCount}
              icon={<RocketOutlined style={{ fontSize: '24px', color: token.colorError }} />}
              color={token.colorErrorBg}
            />
          </Col>
          <Col span={6}>
            <StatCard
              title={t("datasource")}
              value={stats.dataSourceCount}
              icon={<DatabaseOutlined style={{ fontSize: '24px', color: token.colorInfo }} />}
              color={token.colorInfoBg}
            />
          </Col>
        </Row>

        {/* 系统监控组件 */}
        <SystemMonitoring />

        <Row style={{ marginTop: 10, flex: 1 }} gutter={16}>
          <Col span={24}>
            <Card
              className="flex flex-1 flex-col overflow-hidden"
              style={{ height: "450px" }}
              title={t("trend_analysis")}
              extra={
                <Space>
                  <Button
                    onClick={() => handleQuickSelect("today")}
                    type={selectedQuickSelect === "today" ? "primary" : "text"}
                    size="small"
                  >
                    {t("today")}
                  </Button>
                  <Button
                    onClick={() => handleQuickSelect("week")}
                    type={selectedQuickSelect === "week" ? "primary" : "text"}
                    size="small"
                  >
                    {t("week")}
                  </Button>
                  <Button
                    onClick={() => handleQuickSelect("month")}
                    type={selectedQuickSelect === "month" ? "primary" : "text"}
                    size="small"
                  >
                    {t("month")}
                  </Button>
                  <Button
                    onClick={() => handleQuickSelect("year")}
                    type={selectedQuickSelect === "year" ? "primary" : "text"}
                    size="small"
                  >
                    {t("year")}
                  </Button>
                  <RangePicker
                    value={dateRange}
                    onChange={handleDateChange}
                    style={selectedQuickSelect === "custom" ? { borderColor: token.colorPrimary } : {}}
                    size="small"
                  />
                </Space>
              }
            >
              <Row gutter={16} className="h-full">
                <Col span={18}>
                  <ReactECharts option={chartConfig} style={{ height: "420px" }} />
                </Col>
                <Col span={6} className="flex flex-col">
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: "500", marginBottom: "16px", color: token.colorText }}>
                      {t("api_ranking")}
                    </div>
                    <List
                      style={{
                        height: "300px",
                        overflowY: "auto",
                        overflowX: "hidden",
                      }}
                      className="flex flex-1 relative"
                      dataSource={rankingData}
                      renderItem={(item, index) => (
                        <List.Item style={{ padding: "10px 10px" }}>
                          <div className="flex w-full justify-between">
                            <Space className="overflow-hidden w-60">
                              <Badge count={index + 1} showZero color={index < 3 ? "red" : "green"} />{" "}
                              <span style={{ color: token.colorText }}>{item.name}</span>
                            </Space>
                            <span style={{ color: token.colorText }}>{item.total}</span>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
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

