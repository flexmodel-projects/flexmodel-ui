import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import ReactECharts from 'echarts-for-react';
import {theme} from 'antd';
import {getChartConfig, getCurrentTabData} from './chartUtils';

const { useToken } = theme;

interface MonitoringChartProps {
  activeTab: string;
  metricsData: any;
  dataZoomRange: { start: number; end: number };
  onDataZoomChange: (range: { start: number; end: number }) => void;
}

const MonitoringChart: React.FC<MonitoringChartProps> = ({
  activeTab,
  metricsData,
  dataZoomRange,
  onDataZoomChange
}) => {
  const { token } = useToken();
  const chartRef = useRef<ReactECharts>(null);

  const chartConfig = useMemo(() => getChartConfig(activeTab), [activeTab]);
  const currentTabData = useMemo(() => getCurrentTabData(metricsData, activeTab), [metricsData, activeTab]);

  const chartOption = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: token.colorBgElevated,
      borderColor: token.colorBorder,
      textStyle: {
        color: token.colorText,
      },
      formatter: chartConfig.tooltipFormatter,
    },
    legend: {
      data: chartConfig.legend,
      textStyle: {
        color: token.colorText,
      },
      top: 10,
      right: 20,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: currentTabData.time,
      axisLine: {
        lineStyle: {
          color: token.colorBorder,
        },
      },
      axisLabel: {
        color: '#999999',
        fontSize: 12,
        formatter: (value: string) => {
          if (value.includes(':')) {
            return value;
          }
          try {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              return date.toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              });
            }
          } catch {
            // 转换失败，返回原值
          }
          return value;
        },
        interval: 0,
        rotate: 45,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
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
    dataZoom: [
      {
        type: 'slider',
        show: true,
        xAxisIndex: [0],
        start: dataZoomRange.start,
        end: dataZoomRange.end,
        height: 30,
        bottom: 10,
        backgroundColor: '#f0f0f0',
        fillerColor: 'rgba(24, 144, 255, 0.2)',
        borderColor: '#d9d9d9',
        handleStyle: {
          color: '#ffffff',
          borderColor: '#d9d9d9',
          borderWidth: 1,
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.3)',
          shadowOffsetX: 2,
          shadowOffsetY: 2,
        },
        textStyle: {
          color: '#666666',
          fontSize: 12,
        },
        showDetail: false,
        showDataShadow: true,
        realtime: true,
        filterMode: 'filter',
      }
    ],
    series: [
      {
        name: chartConfig.legend[0],
        type: 'line',
        data: currentTabData.series1,
        smooth: true,
        lineStyle: {
          width: 3,
          color: token.colorPrimary,
        },
        itemStyle: {
          color: token.colorPrimary,
        },
        areaStyle: {
          color: token.colorPrimary + '20',
        },
      },
      {
        name: chartConfig.legend[1],
        type: 'line',
        data: currentTabData.series2,
        smooth: true,
        lineStyle: {
          width: 3,
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
        name: chartConfig.legend[2],
        type: 'line',
        data: currentTabData.series3,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorWarning,
        },
        itemStyle: {
          color: token.colorWarning,
        },
      },
      {
        name: chartConfig.legend[3],
        type: 'line',
        data: currentTabData.series4,
        smooth: true,
        lineStyle: {
          width: 2,
          color: token.colorInfo,
        },
        itemStyle: {
          color: token.colorInfo,
        },
      },
    ],
  }), [chartConfig, currentTabData, dataZoomRange, token]);

  const handleDataZoom = useCallback((params: any) => {
    if (params.batch && params.batch[0]) {
      const { start, end } = params.batch[0];
      onDataZoomChange({ start, end });
    }
  }, [onDataZoomChange]);

  // 在数据更新后恢复dataZoom状态
  useEffect(() => {
    if (chartRef.current && metricsData && (dataZoomRange.start !== 0 || dataZoomRange.end !== 100)) {
      const timer = setTimeout(() => {
        const chartInstance = chartRef.current?.getEchartsInstance();
        if (chartInstance) {
          chartInstance.dispatchAction({
            type: 'dataZoom',
            start: dataZoomRange.start,
            end: dataZoomRange.end,
            dataZoomIndex: 0
          });
        }
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [metricsData, dataZoomRange]);

  return (
    <div style={{ marginTop: '24px' }}>
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height: '350px', width: '100%' }}
        onEvents={{
          dataZoom: handleDataZoom
        }}
        key={`chart-${activeTab}`}
        notMerge={true}
        lazyUpdate={true}
      />
    </div>
  );
};

export default MonitoringChart;
