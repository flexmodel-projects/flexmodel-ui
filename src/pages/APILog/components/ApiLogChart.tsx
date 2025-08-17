import React from "react";
import ReactECharts from "echarts-for-react";

interface ApiLogChartProps {
  chartData: {
    xAxis: string[];
    series: number[];
  };
  height?: string | number;
  width?: string | number;
}

const ApiLogChart: React.FC<ApiLogChartProps> = ({ 
  chartData, 
  height = '200px', 
  width = '100%' 
}) => {
  const getChartOption = () => ({
    tooltip: {
      trigger: "axis",
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#ccc',
      borderWidth: 1,
      textStyle: {
        color: '#333'
      }
    },
    grid: {
      top: "15%",
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: chartData.xAxis,
      axisLabel: {
        formatter: function (value: string) {
          const date = new Date(value);
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date
              .getDate()
              .toString()
              .padStart(2, "0")} ${date
                .getHours()
                .toString()
                .padStart(2, "0")}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`;
        },
      },
    },
    yAxis: {
      splitNumber: 2,
      type: "value",
    },
    series: [
      {
        name: "Total requests",
        type: "line",
        stack: "Total",
        data: chartData.series,
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        itemStyle: {
          color: '#1890ff',
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          itemStyle: {
            color: '#1890ff',
            borderWidth: 3,
            borderColor: '#fff',
            shadowBlur: 10,
            shadowColor: 'rgba(24, 144, 255, 0.5)'
          }
        }
      },
    ],
  });

  return (
    <div style={{ height, width }}>
      <ReactECharts
        option={getChartOption()}
        style={{ height: '100%', width: '100%' }}
      />
    </div>
  );
};

export default ApiLogChart;
