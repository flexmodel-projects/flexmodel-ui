import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Progress, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;


const ThreadChart: React.FC = () => {
  const { token } = useToken();
  const { data: metricsData, loading, error } = useMetricsData();

  if (loading && !metricsData) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '16px' }}>
        <Alert
          message="线程监控数据加载失败"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!metricsData) {
    return null;
  }

  const totalThreads = metricsData.threads.threadCount;
  const runnableThreads = metricsData.threads.threadStates.RUNNABLE || 0;
  const blockedThreads = metricsData.threads.threadStates.BLOCKED || 0;

  // 线程趋势图
  const trendOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: {
        color: token.colorText,
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: metricsData.history.time,
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: token.colorText,
        fontSize: 10,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: token.colorText,
      },
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      splitLine: {
        lineStyle: {
          color: token.colorBorderSecondary,
        },
      },
    },
    series: [
      {
        name: '总线程数',
        type: 'line',
        data: metricsData.history.threads,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorPrimary,
        },
        itemStyle: {
          color: token.colorPrimary,
        },
      },
      {
        name: '运行中线程',
        type: 'line',
        data: metricsData.history.threads.map(() => runnableThreads),
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorSuccess,
        },
        itemStyle: {
          color: token.colorSuccess,
        },
      },
      {
        name: '阻塞线程',
        type: 'line',
        data: metricsData.history.threads.map(() => blockedThreads),
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorError,
        },
        itemStyle: {
          color: token.colorError,
        },
      },
    ],
  };

  const activePercent = totalThreads > 0 ? (runnableThreads / totalThreads * 100).toFixed(1) : '0';
  const blockedPercent = totalThreads > 0 ? (blockedThreads / totalThreads * 100).toFixed(1) : '0';

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总线程数"
            value={totalThreads}
            valueStyle={{ fontSize: '16px', color: token.colorPrimary }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="运行中线程"
            value={runnableThreads}
            valueStyle={{ fontSize: '16px', color: token.colorSuccess }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="阻塞线程"
            value={blockedThreads}
            valueStyle={{ fontSize: '16px', color: token.colorError }}
          />
        </Col>
      </Row>

      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={parseFloat(activePercent)}
              size={50}
              strokeColor={token.colorSuccess}
              format={() => `${activePercent}%`}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              活跃率
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={parseFloat(blockedPercent)}
              size={50}
              strokeColor={token.colorError}
              format={() => `${blockedPercent}%`}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              阻塞率
            </div>
          </div>
        </Col>
      </Row>

      {/* 趋势图 */}
      <ReactECharts
        option={trendOption}
        style={{ height: '150px', width: '100%' }}
      />
    </div>
  );
};

export default ThreadChart;
