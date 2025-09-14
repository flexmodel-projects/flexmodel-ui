import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Progress, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;


const JVMChart: React.FC = () => {
  const { token } = useToken();
  const { data: metricsData, loading, error } = useMetricsData();

  // 格式化字节
  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['B', 'KB', 'MB', 'GB'];
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
          message="JVM监控数据加载失败"
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
  const totalGcTime = Object.values(metricsData.jvm.garbageCollectors).reduce((sum, gc) => sum + gc.collectionTime, 0);
  const totalGcCount = Object.values(metricsData.jvm.garbageCollectors).reduce((sum, gc) => sum + gc.collectionCount, 0);
  const threadCount = metricsData.threads.threadCount;

  // JVM内存使用趋势图
  const memoryOption = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: {
        color: token.colorText,
      },
      formatter: function (params: any) {
        let result = params[0].name + '<br/>';
        params.forEach((param: any) => {
          result += param.seriesName + ': ' + formatBytes(param.value * 1024 * 1024) + '<br/>';
        });
        return result;
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
      name: '内存 (MB)',
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
        name: '堆内存使用率',
        type: 'line',
        data: metricsData.history.jvm,
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
        data: metricsData.history.jvm.map(() => metricsData.memory.nonHeap.usagePercentage),
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorWarning,
          type: 'dashed',
        },
        itemStyle: {
          color: token.colorWarning,
        },
      },
    ],
  };

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={Math.round(heapUsage)}
              size={50}
              strokeColor={heapUsage > 80 ? token.colorError : token.colorSuccess}
              format={(percent) => `${percent}%`}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              堆内存使用率
            </div>
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="堆内存使用"
            value={formatBytes(heapUsed * 1024 * 1024, 1)}
            valueStyle={{ fontSize: '16px', color: token.colorError }}
          />
          <div style={{ fontSize: '10px', color: token.colorTextSecondary }}>
            最大: {formatBytes(heapMax * 1024 * 1024, 1)}
          </div>
        </Col>
        <Col span={8}>
          <Statistic
            title="线程数"
            value={threadCount}
            valueStyle={{ fontSize: '16px', color: token.colorPrimary }}
          />
          <div style={{ fontSize: '10px', color: token.colorTextSecondary }}>
            GC时间: {totalGcTime}ms (次数: {totalGcCount})
          </div>
        </Col>
      </Row>

      {/* 内存趋势图 */}
      <ReactECharts
        option={memoryOption}
        style={{ height: '150px', width: '100%' }}
      />
    </div>
  );
};

export default JVMChart;
