import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Progress, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;


const DiskIOChart: React.FC = () => {
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
          message="磁盘监控数据加载失败"
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

  const diskUsage = metricsData.disk.diskIo.fileSystemStats.spaceUtilization;
  const totalSpace = metricsData.disk.totalSpace / (1024 * 1024 * 1024); // GB
  const usedSpace = metricsData.disk.totalSpace * (diskUsage / 100) / (1024 * 1024 * 1024); // GB

  // I/O性能趋势图
  const ioOption = {
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
      name: '速度 (MB/s)',
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
        name: '磁盘使用率',
        type: 'line',
        data: metricsData.history.disk,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorSuccess,
        },
        itemStyle: {
          color: token.colorSuccess,
        },
        areaStyle: {
          color: token.colorSuccess + '20',
        },
      },
      {
        name: '可用空间率',
        type: 'line',
        data: metricsData.history.disk.map(() => 100 - diskUsage),
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
    ],
  };

  const currentUtilization = Math.round(diskUsage);

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总容量"
            value={totalSpace.toFixed(1)}
            suffix="GB"
            valueStyle={{ fontSize: '16px', color: token.colorSuccess }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="已使用"
            value={usedSpace.toFixed(1)}
            suffix="GB"
            valueStyle={{ fontSize: '16px', color: token.colorError }}
          />
        </Col>
        <Col span={8}>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={currentUtilization}
              size={50}
              strokeColor={currentUtilization > 80 ? token.colorError : token.colorSuccess}
              format={(percent) => `${percent}%`}
            />
            <div style={{ fontSize: '11px', color: token.colorTextSecondary, marginTop: 4 }}>
              I/O利用率
            </div>
          </div>
        </Col>
      </Row>

      {/* 趋势图 */}
      <ReactECharts
        option={ioOption}
        style={{ height: '150px', width: '100%' }}
      />
    </div>
  );
};

export default DiskIOChart;
