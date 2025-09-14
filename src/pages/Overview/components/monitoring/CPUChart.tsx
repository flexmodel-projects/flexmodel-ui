import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Progress, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;

const CPUChart: React.FC = () => {
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
          message="CPU监控数据加载失败"
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

  const cpuUsage = metricsData.cpu.processCpuLoad * 100;
  const systemLoad = metricsData.cpu.systemLoadAverage > 0 ? metricsData.cpu.systemLoadAverage : 0;
  const processorCount = metricsData.cpu.availableProcessors;

  const chartOption = {
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
      min: 0,
      max: 100,
      axisLabel: {
        formatter: '{value}%',
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
        name: 'CPU使用率',
        type: 'line',
        data: metricsData.history.cpu,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorPrimary,
        },
        itemStyle: {
          color: token.colorPrimary,
        },
        areaStyle: {
          color: token.colorPrimary + '20',
        },
      },
    ],
  };

  const usageStatus = cpuUsage > 80 ? 'exception' : cpuUsage > 60 ? 'active' : 'success';

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={Math.round(cpuUsage)}
              size={50}
              status={usageStatus}
              strokeColor={token.colorPrimary}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              使用率
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="系统负载"
            value={systemLoad.toFixed(1)}
            precision={1}
            valueStyle={{ fontSize: '16px', color: token.colorText }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="处理器数"
            value={processorCount}
            suffix="核"
            valueStyle={{ fontSize: '16px', color: token.colorText }}
          />
        </Col>
      </Row>

      {/* 图表 */}
      <ReactECharts
        option={chartOption}
        style={{ height: '150px', width: '100%' }}
      />
    </div>
  );
};

export default CPUChart;
