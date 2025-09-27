import React, {useCallback, useMemo, useState} from 'react';
import {Alert, Button, Card, Popover, Space, Spin, Tag, theme} from 'antd';
import {useTranslation} from 'react-i18next';
import {useMetricsData} from './useMetricsData';
import MonitoringTabs from './MonitoringTabs';
import DetailedInfo from './DetailedInfo';
import MonitoringChart from './MonitoringChart';
import {FullscreenExitOutlined, FullscreenOutlined} from '@ant-design/icons';
import {useFullscreen} from '@/hooks/useFullscreen';

const {useToken} = theme;

const UnifiedMonitoring: React.FC = () => {
  const {t} = useTranslation();
  const {token} = useToken();
  const [activeTab, setActiveTab] = useState('system');
  const [dataZoomRange, setDataZoomRange] = useState<{ start: number; end: number }>({start: 0, end: 100});
  const {data: metricsData, loading, error, updateKey} = useMetricsData();
  const {isFullscreen, toggle, ref} = useFullscreen();

  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key);
  }, []);

  const handleDataZoomChange = useCallback((range: { start: number; end: number }) => {
    setDataZoomRange(range);
  }, []);


  // 生成Tag标题的函数
  const generateTagTitle = useCallback((tabKey: string, cardKey: string) => {
    if (!metricsData) return t('metrics.loading');

    switch (tabKey) {
      case 'system':
        switch (cardKey) {
          case 'cpu':
            return `CPU ${Math.round(metricsData.cpu.processCpuLoad)}%`;
          case 'physical_memory':
            return `${t('metrics.physical_memory')} ${Math.round(metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024))}${t('metrics.gb')}`;
          case 'system':
            return `${metricsData.cpu.name || t('metrics.operating_system')}`;
          case 'jvm':
            return `JVM ${metricsData.jvm.name || t('metrics.unknown')}`;
          default:
            return t('metrics.unknown');
        }
      case 'thread':
        switch (cardKey) {
          case 'thread_stats':
            return `${t('metrics.thread')} ${Math.round(metricsData.threads.threadCount || 0)}${t('metrics.count')}`;
          case 'thread_states': {
            const stateCount = Object.keys(metricsData.threads.threadStates || {}).length;
            return `${t('metrics.thread_states')} ${stateCount}${t('metrics.kinds')}`;
          }
          case 'thread_details': {
            const detailCount = Object.keys(metricsData.threads.threadDetails || {}).length;
            return `${t('metrics.thread_details')} ${detailCount}${t('metrics.count')}`;
          }
          default:
            return t('metrics.unknown');
        }
      case 'network':
        switch (cardKey) {
          case 'network_stats':
            return `${t('metrics.network')} ${Math.round(metricsData.network.totalInterfaces || 0)}${t('metrics.interfaces_count')}`;
          case 'network_interfaces': {
            const activeCount = metricsData.network.stats?.activeInterfaces || 0;
            return `${t('metrics.active_interfaces')} ${Math.round(activeCount)}${t('metrics.active_count')}`;
          }
          default:
            return t('metrics.unknown');
        }
      case 'disk':
        switch (cardKey) {
          case 'disk_stats': {
            const totalSpace = Math.round((metricsData.disk.totalSpace || 0) / (1024 * 1024 * 1024));
            return `${t('metrics.disk')} ${totalSpace}${t('metrics.gb')}`;
          }
          case 'filesystems': {
            const fsCount = metricsData.disk.totalFileSystems || 0;
            return `${t('metrics.file_systems')} ${Math.round(fsCount)}${t('metrics.file_systems_count')}`;
          }
          default:
            return t('metrics.unknown');
        }
      case 'jvm':
        switch (cardKey) {
          case 'basic':
            return `JVM ${metricsData.jvm.version || t('metrics.unknown')}`;
          case 'gc': {
            const gcCount = Object.keys(metricsData.jvm.garbageCollectors || {}).length;
            return `GC ${gcCount}${t('metrics.gc_count')}`;
          }
          case 'heap':
            return `${t('metrics.heap_memory')} ${Math.round(metricsData.memory.heap.usagePercentage || 0)}%`;
          case 'nonheap':
            return `${t('metrics.non_heap_memory')} ${Math.round(metricsData.memory.nonHeap.usagePercentage || 0)}%`;
          case 'memory_pools': {
            const poolCount = Object.keys(metricsData.memory.memoryPools || {}).length;
            return `${t('metrics.memory_pools')} ${poolCount}${t('metrics.count')}`;
          }
          default:
            return t('metrics.unknown');
        }
      default:
        return t('metrics.unknown');
    }
  }, [metricsData, t]);

  // 每个Tab对应的Card标签配置
  const cardTags = useMemo(() => ({
    system: [
      {key: 'cpu', title: generateTagTitle('system', 'cpu'), color: token.colorPrimary},
      {key: 'physical_memory', title: generateTagTitle('system', 'physical_memory'), color: token.colorSuccess},
      {key: 'system', title: generateTagTitle('system', 'system'), color: token.colorWarning},
      {key: 'jvm', title: generateTagTitle('system', 'jvm'), color: token.colorInfo}
    ],
    thread: [
      {key: 'thread_stats', title: generateTagTitle('thread', 'thread_stats'), color: token.colorPrimary},
      {key: 'thread_states', title: generateTagTitle('thread', 'thread_states'), color: token.colorSuccess},
      {key: 'thread_details', title: generateTagTitle('thread', 'thread_details'), color: token.colorWarning}
    ],
    network: [
      {key: 'network_stats', title: generateTagTitle('network', 'network_stats'), color: token.colorPrimary},
      {key: 'network_interfaces', title: generateTagTitle('network', 'network_interfaces'), color: token.colorSuccess}
    ],
    disk: [
      {key: 'disk_stats', title: generateTagTitle('disk', 'disk_stats'), color: token.colorPrimary},
      {key: 'filesystems', title: generateTagTitle('disk', 'filesystems'), color: token.colorSuccess}
    ],
    jvm: [
      {key: 'basic', title: generateTagTitle('jvm', 'basic'), color: token.colorPrimary},
      {key: 'gc', title: generateTagTitle('jvm', 'gc'), color: token.colorWarning},
      {key: 'heap', title: generateTagTitle('jvm', 'heap'), color: token.colorPrimary},
      {key: 'nonheap', title: generateTagTitle('jvm', 'nonheap'), color: token.colorSuccess},
      {key: 'memory_pools', title: generateTagTitle('jvm', 'memory_pools'), color: token.colorWarning}
    ]
  }), [generateTagTitle, token]);

  // 创建Popover内容
  const createPopoverContent = useCallback((cardKey: string) => (
    <DetailedInfo metricsData={metricsData} cardKey={cardKey}/>
  ), [metricsData]);

  if (loading && !metricsData) {
    return (
      <Card
        title={t('metrics.system_monitoring')}
        style={{height: '480px', marginTop: 0,}}
        bodyStyle={{height: '430px', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
      >
        <Spin/>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        title={t('metrics.system_monitoring')}
        style={{height: '480px', marginTop: 0}}
        bodyStyle={{height: '430px', padding: '16px'}}
      >
        <Alert
          message={t('metrics.monitoring_data_load_failed')}
          description={error}
          type="error"
          showIcon
        />
      </Card>
    );
  }


  return (
    <div ref={ref}>
      <Card
        style={{
          height: isFullscreen ? "100%" : "550px", 
          width: '100%', 
          marginTop: 0,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          borderRadius: '12px',
          overflow: 'hidden'
        }}
        title={t('metrics.system_monitoring')}
        extra={
          <Button
            type="text"
            size="small"
            icon={isFullscreen ? <FullscreenExitOutlined/> : <FullscreenOutlined/>}
            onClick={toggle}
            title={isFullscreen ? t('exit_fullscreen') : t('fullscreen')}
          />
        }
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.08)';
        }}
      >
        {/* 监控Tab切换 */}
        <MonitoringTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          metricsData={metricsData}
        />

        {/* 详细监控信息 - 多个Card标签 */}
        <div style={{marginBottom: '16px'}}>
          <Space wrap>
            {cardTags[activeTab as keyof typeof cardTags]?.map((tag) => (
              <Popover
                key={tag.key}
                title={tag.title}
                content={createPopoverContent(tag.key)}
                trigger="hover"
                placement="bottomLeft"
                overlayStyle={{maxWidth: '700px'}}
              >
                <Tag
                  color={tag.color}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = `0 4px 8px ${tag.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = `0 2px 4px ${tag.color}20`;
                  }}
                >
                  {tag.title}
                </Tag>
              </Popover>
            ))}
          </Space>
        </div>

        {/* 监控趋势图 */}
        <MonitoringChart
          activeTab={activeTab}
          metricsData={metricsData}
          dataZoomRange={dataZoomRange}
          onDataZoomChange={handleDataZoomChange}
          updateKey={updateKey}
        />

      </Card>
    </div>
  );
};

export default React.memo(UnifiedMonitoring);
