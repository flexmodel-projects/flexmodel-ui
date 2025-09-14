import React from 'react';
import ReactECharts from 'echarts-for-react';
import {Alert, Col, Row, Spin, Statistic, theme} from 'antd';
import {useMetricsData} from './useMetricsData';

const { useToken } = theme;


const NetworkChart: React.FC = () => {
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
          message="网络监控数据加载失败"
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

  const totalInterfaces = metricsData.network.totalInterfaces;
  const activeInterfaces = metricsData.network.stats.activeInterfaces;
  const upInterfaces = Object.values(metricsData.network.interfaces).filter(iface => iface.up).length;

  // 网络流量趋势图
  const trafficOption = {
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
          if (param.seriesName.includes('流量')) {
            result += param.seriesName + ': ' + formatBytes(param.value) + '<br/>';
          } else {
            result += param.seriesName + ': ' + param.value + '<br/>';
          }
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
      name: '流量 (MB)',
      axisLabel: {
        color: token.colorText,
        formatter: function (value: number) {
          return (value / 1024 / 1024).toFixed(0);
        },
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
        name: '活跃接口比例',
        type: 'line',
        data: metricsData.history.network,
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
        name: '总接口数',
        type: 'line',
        data: metricsData.history.network.map(() => totalInterfaces),
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

  const currentActiveInterfaces = activeInterfaces;

  return (
    <div>
      {/* 实时指标 */}
      <Row gutter={8} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Statistic
            title="总接口数"
            value={totalInterfaces}
            valueStyle={{ fontSize: '16px', color: token.colorSuccess }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="活跃接口"
            value={currentActiveInterfaces}
            valueStyle={{ fontSize: '16px', color: token.colorError }}
          />
        </Col>
        <Col span={8}>
          <Statistic
            title="在线接口"
            value={upInterfaces}
            valueStyle={{ fontSize: '16px', color: token.colorPrimary }}
          />
        </Col>
      </Row>

      {/* 流量趋势图 */}
      <ReactECharts
        option={trafficOption}
        style={{ height: '150px', width: '100%' }}
      />
    </div>
  );
};

export default NetworkChart;
