import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Progress, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;

const MemoryChart: React.FC = () => {
  const { token } = useToken();
  const { data: metricsData, loading, error } = useMetricsData();

  // 格式化字节为GB/MB
  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

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
          message="内存监控数据加载失败"
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

  const heapUsed = metricsData.memory.heap.used / (1024 * 1024); // MB
  const heapMax = metricsData.memory.heap.max / (1024 * 1024); // MB
  const heapUsage = metricsData.memory.heap.usagePercentage;

  // 内存趋势图
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
        formatter: '{value} GB',
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
        name: '堆内存使用率',
        type: 'line',
        data: metricsData.history.memory,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorError,
        },
        itemStyle: {
          color: token.colorError,
        },
        areaStyle: {
          color: token.colorError + '20',
        },
      },
      {
        name: '非堆内存使用率',
        type: 'line',
        data: metricsData.history.memory.map(() => metricsData.memory.nonHeap.usagePercentage),
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorWarning,
        },
        itemStyle: {
          color: token.colorWarning,
        },
      },
    ],
  };

  const memoryUsagePercent = heapUsage.toFixed(1);

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={parseFloat(memoryUsagePercent)}
              size={50}
              strokeColor={token.colorError}
              format={(percent) => `${percent?.toFixed(0)}%`}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              内存使用率
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="堆内存使用"
            value={formatBytes(heapUsed * 1024 * 1024, 1)}
            valueStyle={{ fontSize: '16px', color: token.colorError }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="堆内存最大"
            value={formatBytes(heapMax * 1024 * 1024, 1)}
            valueStyle={{ fontSize: '16px', color: token.colorText }}
          />
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

export default MemoryChart;
