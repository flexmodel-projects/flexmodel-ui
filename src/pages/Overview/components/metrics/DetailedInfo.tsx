import React from 'react';
import {Badge, Card, Col, Descriptions, Row, Table, Tag, theme} from 'antd';
import {useTranslation} from 'react-i18next';

interface DetailedInfoProps {
  activeTab: string;
  metricsData: any;
  cardKey?: string; // 新增cardKey参数，用于指定显示特定的Card
}

const { useToken } = theme;

const DetailedInfo: React.FC<DetailedInfoProps> = ({ activeTab, metricsData, cardKey }) => {
  const { token } = useToken();
  const { t } = useTranslation();
  if (!metricsData) return null;

  // 渲染单个Card的函数
  const renderSingleCard = (cardKey: string) => {
    switch (cardKey) {
      // 系统概览Tab的Card
      case 'cpu':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.system_load_average')}>{Math.round(metricsData.cpu.systemLoadAverage)}%</Descriptions.Item>
            <Descriptions.Item label={t('metrics.process_cpu_usage')}>{Math.round(metricsData.cpu.processCpuLoad)}%</Descriptions.Item>
            <Descriptions.Item label={t('metrics.system_cpu_usage')}>{Math.round(metricsData.cpu.systemCpuLoad)}%</Descriptions.Item>
            <Descriptions.Item label={t('metrics.available_processors')}>{Math.round(metricsData.cpu.availableProcessors)}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.system_architecture')}>{metricsData.cpu.architecture}</Descriptions.Item>
          </Descriptions>
        );
      case 'physical_memory':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.total_physical_memory')}>{Math.round(metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.free_physical_memory')}>{Math.round(metricsData.cpu.freePhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.total_swap_space')}>{Math.round(metricsData.cpu.totalSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.free_swap_space')}>{Math.round(metricsData.cpu.freeSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
          </Descriptions>
        );
      case 'system':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.operating_system')}>{metricsData.cpu.name}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.system_version')}>{metricsData.cpu.version}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.system_load')}>{metricsData.cpu.systemLoadAverage > 0 ? metricsData.cpu.systemLoadAverage.toFixed(2) : 'N/A'}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.uptime')}>{Math.round(metricsData.jvm.uptime / 1000 / 60)}{t('metrics.minutes')}</Descriptions.Item>
          </Descriptions>
        );
      case 'jvm':
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.jvm_name')}>{metricsData.jvm.name}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_version')}>{metricsData.jvm.version}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_vendor')}>{metricsData.jvm.vendor}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.loaded_classes')}>{Math.round(metricsData.jvm.loadedClassCount)}{t('metrics.count')}</Descriptions.Item>
          </Descriptions>
        );

      // 内存Tab的Card
      case 'heap': {
        const heap = metricsData?.memory?.heap || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.initial_size')}>{heap.init ? Math.round(heap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.used')}>{heap.used ? Math.round(heap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.committed')}>{heap.committed ? Math.round(heap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.max_size')}>{heap.max ? Math.round(heap.max / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.usage_percentage')}>{Math.round(heap.usagePercentage || 0)}%</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'nonheap': {
        const nonHeap = metricsData?.memory?.nonHeap || {};
        return (
          <Descriptions column={1} size="small">
            <Descriptions.Item label={t('metrics.initial_size')}>{nonHeap.init ? Math.round(nonHeap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.used')}>{nonHeap.used ? Math.round(nonHeap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.committed')}>{nonHeap.committed ? Math.round(nonHeap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.max_size')}>{nonHeap.max === -1 ? t('metrics.unlimited') : nonHeap.max ? Math.round(nonHeap.max / (1024 * 1024)) + t('metrics.mb') : '0' + t('metrics.mb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.usage_percentage')}>{Math.round(nonHeap.usagePercentage || 0)}%</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'pools': {
        const memoryPools = metricsData?.memory?.memoryPools || {};
        return (
          <div>
            <Table
              size="small"
              dataSource={Object.entries(memoryPools).map(([name, pool]: [string, any]) => ({
                key: name,
                name,
                type: pool.type || '未知',
                init: pool.init ? Math.round(pool.init / (1024 * 1024)) : 0,
                used: pool.used ? Math.round(pool.used / (1024 * 1024)) : 0,
                committed: pool.committed ? Math.round(pool.committed / (1024 * 1024)) : 0,
                max: pool.max === -1 ? '无限制' : pool.max ? Math.round(pool.max / (1024 * 1024)) : 0,
                usagePercentage: Math.round(pool.usagePercentage || 0),
                memoryManagerNames: pool.memoryManagerNames || [],
              }))}
              columns={[
                { title: t('name'), dataIndex: 'name', key: 'name' },
                { title: t('metrics.type'), dataIndex: 'type', key: 'type' },
                { title: t('metrics.initial_size') + '(' + t('metrics.mb') + ')', dataIndex: 'init', key: 'init' },
                { title: t('metrics.used') + '(' + t('metrics.mb') + ')', dataIndex: 'used', key: 'used' },
                { title: t('metrics.committed') + '(' + t('metrics.mb') + ')', dataIndex: 'committed', key: 'committed' },
                { title: t('metrics.max_size') + '(' + t('metrics.mb') + ')', dataIndex: 'max', key: 'max' },
                {
                  title: t('metrics.usage_percentage'),
                  dataIndex: 'usagePercentage',
                  key: 'usagePercentage',
                  render: (percentage: number) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '8px', backgroundColor: token.colorFillSecondary, borderRadius: '4px' }}>
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span>{percentage}%</span>
                    </div>
                  )
                },
                { title: t('metrics.memory_manager'), dataIndex: 'memoryManagerNames', key: 'memoryManagerNames', render: (names: any) => Array.isArray(names) ? names.join(', ') : (names || t('metrics.unknown')) },
              ]}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </div>
        );
      }

      // JVM Tab的Card
      case 'basic': {
        const jvm = metricsData?.jvm || {};
        return (
          <Descriptions column={2} size="small">
            <Descriptions.Item label={t('metrics.jvm_name')}>{jvm.name || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_version')}>{jvm.version || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.jvm_vendor')}>{jvm.vendor || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.uptime')}>{jvm.uptime ? Math.round(jvm.uptime / 1000 / 60) : 0} {t('metrics.minutes')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.start_time')}>{jvm.startTime ? new Date(jvm.startTime).toLocaleString() : t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.loaded_classes')}>{jvm.loadedClassCount || 0}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.total_loaded_classes')}>{jvm.totalLoadedClassCount || 0}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.unloaded_classes')}>{jvm.unloadedClassCount || 0}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'properties': {
        const systemProperties = metricsData?.jvm?.systemProperties || {};
        return (
          <div>
            <Table
              size="small"
              dataSource={Object.entries(systemProperties).map(([key, value]: [string, any]) => ({
                key,
                property: key,
                value: value || '未知',
              }))}
              columns={[
                {
                  title: t('metrics.property_name'),
                  dataIndex: 'property',
                  key: 'property',
                  width: '40%',
                  ellipsis: true
                },
                {
                  title: t('metrics.property_value'),
                  dataIndex: 'value',
                  key: 'value',
                  width: '60%',
                  render: (value: string) => (
                    <div style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      wordBreak: 'break-all',
                      maxWidth: '100%'
                    }}>
                      {value}
                    </div>
                  )
                },
              ]}
              pagination={false}
              scroll={{ y: 200 }}
            />
          </div>
        );
      }
      case 'gc': {
        const garbageCollectors = metricsData?.jvm?.garbageCollectors || {};
        return (
          <div>
            <h4>{t('metrics.garbage_collectors')}</h4>
            <Table
              size="small"
              dataSource={Object.entries(garbageCollectors).map(([name, gc]: [string, any]) => ({
                key: name,
                name,
                collectionCount: gc.collectionCount || 0,
                collectionTime: gc.collectionTime || 0,
              }))}
              columns={[
                { title: t('metrics.collector_name'), dataIndex: 'name', key: 'name' },
                { title: t('metrics.collection_count'), dataIndex: 'collectionCount', key: 'collectionCount' },
                { title: t('metrics.collection_time') + '(' + t('metrics.ms') + ')', dataIndex: 'collectionTime', key: 'collectionTime' },
              ]}
              pagination={false}
              scroll={{ y: 200 }}
            />
          </div>
        );
      }

      // 线程Tab的Card
      case 'stats': {
        const threads = metricsData?.threads || {};
        return (
          <Descriptions column={1} size="small" title={t('metrics.thread_stats')}>
            <Descriptions.Item label={t('metrics.current_threads')}>{threads.threadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.peak_threads')}>{threads.peakThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.daemon_threads')}>{threads.daemonThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.started_threads')}>{threads.totalStartedThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'states': {
        const threadStates = metricsData?.threads?.threadStates || {};
        return (
          <div>
            <h4>{t('metrics.thread_states')}</h4>
            {Object.entries(threadStates).map(([state, count]: [string, any]) => (
              <div key={state} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Tag color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                  {state}
                </Tag>
                <span>{count} {t('metrics.count')}</span>
              </div>
            ))}
          </div>
        );
      }
      case 'details': {
        const threadDetails = metricsData?.threads?.threads || metricsData?.threads?.threadDetails || {};
        return (
          <div>
            <h4>{t('metrics.thread_details')}</h4>
            <Table
              size="small"
              dataSource={Object.entries(threadDetails).map(([id, thread]: [string, any]) => ({
                key: id,
                id: thread.threadId || id,
                name: thread.threadName || thread.name || '未知',
                state: thread.threadState || thread.state || 'UNKNOWN',
                blockedCount: thread.blockedCount || 0,
                waitedCount: thread.waitedCount || 0,
                cpuTime: thread.cpuTime || 0,
                userTime: thread.userTime || 0,
              }))}
              columns={[
                { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
                { title: t('name'), dataIndex: 'name', key: 'name', ellipsis: true },
                {
                  title: t('metrics.status'),
                  dataIndex: 'state',
                  key: 'state',
                  render: (state: string) => (
                    <Tag color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                      {state}
                    </Tag>
                  )
                },
                { title: t('metrics.blocked_count'), dataIndex: 'blockedCount', key: 'blockedCount' },
                { title: t('metrics.waited_count'), dataIndex: 'waitedCount', key: 'waitedCount' },
                { title: t('metrics.cpu_time') + '(' + t('metrics.ms') + ')', dataIndex: 'cpuTime', key: 'cpuTime' },
                { title: t('metrics.user_time') + '(' + t('metrics.ms') + ')', dataIndex: 'userTime', key: 'userTime' },
              ]}
              pagination={false}
              scroll={{ y: 200 }}
            />
          </div>
        );
      }

      // 网络Tab的Card
      case 'network-stats': {
        const network = metricsData?.network || {};
        const networkStats = network.stats || {};
        const localhost = network.localhost || {};
        return (
          <Descriptions column={1} size="small" title={t('metrics.network_stats')}>
            <Descriptions.Item label={t('metrics.total_interfaces')}>{network.totalInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.active_interfaces')}>{networkStats.activeInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.hostname')}>{localhost.hostName || t('metrics.unknown')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.host_address')}>{localhost.hostAddress || t('metrics.unknown')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'interfaces': {
        const interfaces = metricsData?.network?.interfaces || {};
        return (
          <div>
            <h4>{t('metrics.network_interface_details')}</h4>
            <Table
              size="small"
              dataSource={Object.entries(interfaces).map(([name, iface]: [string, any]) => ({
                key: name,
                name: iface.name || name,
                displayName: iface.displayName || '未知',
                up: iface.up || false,
                virtual: iface.virtual || false,
                loopback: iface.loopback || false,
                pointToPoint: iface.pointToPoint || false,
                mtu: iface.mtu || 0,
                macAddress: iface.macAddress || '未知',
                addressCount: iface.addresses ? Object.keys(iface.addresses).length : 0,
              }))}
              columns={[
                { title: t('name'), dataIndex: 'name', key: 'name' },
                { title: t('metrics.display_name'), dataIndex: 'displayName', key: 'displayName', ellipsis: true },
                {
                  title: t('metrics.status'),
                  dataIndex: 'up',
                  key: 'up',
                  render: (up: boolean) => (
                    <Badge status={up ? 'success' : 'error'} text={up ? t('metrics.online') : t('metrics.offline')} />
                  )
                },
                {
                  title: t('metrics.type'),
                  key: 'type',
                  render: (_, record: any) => (
                    <div>
                      {record.virtual && <Tag>{t('metrics.virtual')}</Tag>}
                      {record.loopback && <Tag>{t('metrics.loopback')}</Tag>}
                      {record.pointToPoint && <Tag>{t('metrics.point_to_point')}</Tag>}
                    </div>
                  )
                },
                { title: 'MTU', dataIndex: 'mtu', key: 'mtu' },
                { title: t('metrics.mac_address'), dataIndex: 'macAddress', key: 'macAddress', ellipsis: true },
                { title: t('metrics.address_count'), dataIndex: 'addressCount', key: 'addressCount' },
              ]}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </div>
        );
      }

      // 磁盘Tab的Card
      case 'disk-stats': {
        const disk = metricsData?.disk || {};
        return (
          <Descriptions column={1} size="small" title={t('metrics.disk_stats')}>
            <Descriptions.Item label={t('metrics.file_systems')}>{disk.totalFileSystems || 0}{t('metrics.count')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.total_space')}>{disk.totalSpace ? Math.round(disk.totalSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.available_space')}>{disk.totalUsableSpace ? Math.round(disk.totalUsableSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
            <Descriptions.Item label={t('metrics.free_space')}>{disk.totalFreeSpace ? Math.round(disk.totalFreeSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
          </Descriptions>
        );
      }
      case 'filesystems': {
        const fileSystems = metricsData?.disk?.fileSystems || {};
        return (
          <div>
            <h4>{t('metrics.file_system_details')}</h4>
            <Table
              size="small"
              dataSource={Object.entries(fileSystems).map(([name, fs]: [string, any]) => ({
                key: name,
                name: name || '未知',
                type: fs.type || '未知',
                totalSpace: fs.totalSpace ? Math.round(fs.totalSpace / (1024 * 1024 * 1024)) : 0,
                usableSpace: fs.usableSpace ? Math.round(fs.usableSpace / (1024 * 1024 * 1024)) : 0,
                freeSpace: fs.freeSpace ? Math.round(fs.freeSpace / (1024 * 1024 * 1024)) : 0,
                usagePercentage: fs.totalSpace && fs.freeSpace ? Math.round((fs.totalSpace - fs.freeSpace) / fs.totalSpace * 100) : 0,
              }))}
              columns={[
                { title: t('name'), dataIndex: 'name', key: 'name' },
                { title: t('metrics.type'), dataIndex: 'type', key: 'type' },
                { title: t('metrics.total_space') + '(' + t('metrics.gb') + ')', dataIndex: 'totalSpace', key: 'totalSpace' },
                { title: t('metrics.available_space') + '(' + t('metrics.gb') + ')', dataIndex: 'usableSpace', key: 'usableSpace' },
                { title: t('metrics.free_space') + '(' + t('metrics.gb') + ')', dataIndex: 'freeSpace', key: 'freeSpace' },
                {
                  title: t('metrics.usage_percentage'),
                  dataIndex: 'usagePercentage',
                  key: 'usagePercentage',
                  render: (percentage: number) => (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '60px', height: '8px', backgroundColor: token.colorFillSecondary, borderRadius: '4px' }}>
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                            borderRadius: '4px'
                          }}
                        />
                      </div>
                      <span>{percentage}%</span>
                    </div>
                  )
                },
              ]}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  const renderSystemInfo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small" title={t('metrics.cpu_info')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('metrics.process_cpu_usage')}>{Math.round(metricsData.cpu.processCpuLoad * 100)}%</Descriptions.Item>
              <Descriptions.Item label={t('metrics.system_cpu_usage')}>{Math.round(metricsData.cpu.systemCpuLoad * 100)}%</Descriptions.Item>
              <Descriptions.Item label={t('metrics.available_processors')}>{Math.round(metricsData.cpu.availableProcessors)}{t('metrics.count')}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.system_architecture')}>{metricsData.cpu.architecture}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title={t('metrics.memory_info')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('metrics.total_physical_memory')}>{Math.round(metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.free_physical_memory')}>{Math.round(metricsData.cpu.freePhysicalMemorySize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.total_swap_space')}>{Math.round(metricsData.cpu.totalSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.free_swap_space')}>{Math.round(metricsData.cpu.freeSwapSpaceSize / (1024 * 1024 * 1024))}{t('metrics.gb')}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title={t('metrics.system_info')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('metrics.operating_system')}>{metricsData.cpu.name}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.system_version')}>{metricsData.cpu.version}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.system_load')}>{metricsData.cpu.systemLoadAverage > 0 ? metricsData.cpu.systemLoadAverage.toFixed(2) : 'N/A'}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.uptime')}>{Math.round(metricsData.jvm.uptime / 1000 / 60)}{t('metrics.minutes')}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title={t('metrics.jvm_info')}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label={t('metrics.jvm_name')}>{metricsData.jvm.name}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.jvm_version')}>{metricsData.jvm.version}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.jvm_vendor')}>{metricsData.jvm.vendor}</Descriptions.Item>
              <Descriptions.Item label={t('metrics.loaded_classes')}>{Math.round(metricsData.jvm.loadedClassCount)}{t('metrics.count')}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );

  const renderJvmInfo = () => {
    const jvm = metricsData?.jvm || {};
    const garbageCollectors = jvm.garbageCollectors || {};
    const systemProperties = jvm.systemProperties || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title={t('metrics.jvm_basic_info')}>
              <Descriptions column={2} size="small">
                <Descriptions.Item label={t('metrics.jvm_name')}>{jvm.name || t('metrics.unknown')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.jvm_version')}>{jvm.version || t('metrics.unknown')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.jvm_vendor')}>{jvm.vendor || t('metrics.unknown')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.uptime')}>{jvm.uptime ? Math.round(jvm.uptime / 1000 / 60) : 0} {t('metrics.minutes')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.start_time')}>{jvm.startTime ? new Date(jvm.startTime).toLocaleString() : t('metrics.unknown')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.loaded_classes')}>{jvm.loadedClassCount || 0}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.total_loaded_classes')}>{jvm.totalLoadedClassCount || 0}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.unloaded_classes')}>{jvm.unloadedClassCount || 0}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={5}>
            <Card size='small' title={t('metrics.system_properties')}>
              <Table
                size="small"
                dataSource={Object.entries(systemProperties).map(([key, value]: [string, any]) => ({
                  key,
                  property: key,
                  value: value || '未知',
                }))}
                columns={[
                  {
                    title: '属性名称',
                    dataIndex: 'property',
                    key: 'property',
                    width: '40%',
                    ellipsis: true
                  },
                  {
                    title: '属性值',
                    dataIndex: 'value',
                    key: 'value',
                    width: '60%',
                    render: (value: string) => (
                      <div style={{
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        wordBreak: 'break-all',
                        maxWidth: '100%'
                      }}>
                        {value}
                      </div>
                    )
                  },
                ]}
                pagination={false}
                scroll={{ y: 200 }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size='small' title={t('metrics.garbage_collectors')}>
              <Table
                size="small"
                dataSource={Object.entries(garbageCollectors).map(([name, gc]: [string, any]) => ({
                  key: name,
                  name,
                  collectionCount: gc.collectionCount || 0,
                  collectionTime: gc.collectionTime || 0,
                }))}
                columns={[
                  { title: '收集器名称', dataIndex: 'name', key: 'name' },
                  { title: '收集次数', dataIndex: 'collectionCount', key: 'collectionCount' },
                  { title: '收集时间(ms)', dataIndex: 'collectionTime', key: 'collectionTime' },
                ]}
                pagination={false}
                scroll={{ y: 200 }}
              />
            </Card>
          </Col>

        </Row>
      </div>
    );
  };

  const renderMemoryInfo = () => {
    const memory = metricsData?.memory || {};
    const heap = memory.heap || {};
    const nonHeap = memory.nonHeap || {};
    const memoryPools = memory.memoryPools || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Card size="small" title={t('metrics.heap_memory')}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('metrics.initial_size')}>{heap.init ? Math.round(heap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.used')}>{heap.used ? Math.round(heap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.committed')}>{heap.committed ? Math.round(heap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.max_size')}>{heap.max ? Math.round(heap.max / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.usage_percentage')}>{Math.round(heap.usagePercentage || 0)}%</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title={t('metrics.non_heap_memory')}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('metrics.initial_size')}>{nonHeap.init ? Math.round(nonHeap.init / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.used')}>{nonHeap.used ? Math.round(nonHeap.used / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.committed')}>{nonHeap.committed ? Math.round(nonHeap.committed / (1024 * 1024)) : 0}{t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.max_size')}>{nonHeap.max === -1 ? t('metrics.unlimited') : nonHeap.max ? Math.round(nonHeap.max / (1024 * 1024)) + t('metrics.mb') : '0' + t('metrics.mb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.usage_percentage')}>{Math.round(nonHeap.usagePercentage || 0)}%</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Card size='small' title={t('metrics.memory_pools')}>
          <Table
            size="small"
            dataSource={Object.entries(memoryPools).map(([name, pool]: [string, any]) => ({
              key: name,
              name,
              type: pool.type || '未知',
              init: pool.init ? Math.round(pool.init / (1024 * 1024)) : 0,
              used: pool.used ? Math.round(pool.used / (1024 * 1024)) : 0,
              committed: pool.committed ? Math.round(pool.committed / (1024 * 1024)) : 0,
              max: pool.max === -1 ? '无限制' : pool.max ? Math.round(pool.max / (1024 * 1024)) : 0,
              usagePercentage: Math.round(pool.usagePercentage || 0),
              memoryManagerNames: pool.memoryManagerNames || [],
            }))}
            columns={[
              { title: '名称', dataIndex: 'name', key: 'name' },
              { title: '类型', dataIndex: 'type', key: 'type' },
              { title: '初始(MB)', dataIndex: 'init', key: 'init' },
              { title: '已使用(MB)', dataIndex: 'used', key: 'used' },
              { title: '已提交(MB)', dataIndex: 'committed', key: 'committed' },
              { title: '最大(MB)', dataIndex: 'max', key: 'max' },
              {
                title: '使用率',
                dataIndex: 'usagePercentage',
                key: 'usagePercentage',
                render: (percentage: number) => (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '60px', height: '8px', backgroundColor: token.colorFillSecondary, borderRadius: '4px' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                          borderRadius: '4px'
                        }}
                      />
                    </div>
                    <span>{percentage}%</span>
                  </div>
                )
              },
              { title: '内存管理器', dataIndex: 'memoryManagerNames', key: 'memoryManagerNames', render: (names: any) => Array.isArray(names) ? names.join(', ') : (names || '未知') },
            ]}
            pagination={false}
            scroll={{ y: 300 }}
          />
        </Card>
      </div>
    );
  };

  const renderThreadInfo = () => {
    // 安全检查，确保数据结构存在
    const threads = metricsData?.threads || {};
    const threadStates = threads.threadStates || {};
    const threadDetails = threads.threads || threads.threadDetails || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <Card size="small" title={t('metrics.thread_stats')}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('metrics.current_threads')}>{threads.threadCount || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.peak_threads')}>{threads.peakThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.daemon_threads')}>{threads.daemonThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.started_threads')}>{threads.totalStartedThreadCount || 0}{t('metrics.count')}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={6}>
            <Card size='small' title={t('metrics.thread_states')}>
              {Object.entries(threadStates).map(([state, count]: [string, any]) => (
                <div key={state} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Tag color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                    {state}
                  </Tag>
                  <span>{count} {t('metrics.count')}</span>
                </div>
              ))}
            </Card>
          </Col>
          <Col span={12}>
            <Card size='small' title={t('metrics.thread_details')}>
              <Table
                size="small"
                dataSource={Object.entries(threadDetails).map(([id, thread]: [string, any]) => ({
                  key: id,
                  id: thread.threadId || id,
                  name: thread.threadName || thread.name || '未知',
                  state: thread.threadState || thread.state || 'UNKNOWN',
                  blockedCount: thread.blockedCount || 0,
                  waitedCount: thread.waitedCount || 0,
                  cpuTime: thread.cpuTime || 0,
                  userTime: thread.userTime || 0,
                }))}
                columns={[
                  { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
                  { title: '名称', dataIndex: 'name', key: 'name', ellipsis: true },
                  {
                    title: '状态',
                    dataIndex: 'state',
                    key: 'state',
                    render: (state: string) => (
                      <Tag color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                        {state}
                      </Tag>
                    )
                  },
                  { title: '阻塞次数', dataIndex: 'blockedCount', key: 'blockedCount' },
                  { title: '等待次数', dataIndex: 'waitedCount', key: 'waitedCount' },
                  { title: 'CPU时间(ms)', dataIndex: 'cpuTime', key: 'cpuTime' },
                  { title: '用户时间(ms)', dataIndex: 'userTime', key: 'userTime' },
                ]}
                pagination={false}
                scroll={{ y: 200 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderNetworkInfo = () => {
    const network = metricsData?.network || {};
    const stats = network.stats || {};
    const localhost = network.localhost || {};
    const interfaces = network.interfaces || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title={t('metrics.network_stats')}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('metrics.total_interfaces')}>{network.totalInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.active_interfaces')}>{stats.activeInterfaces || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.hostname')}>{localhost.hostName || t('metrics.unknown')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.host_address')}>{localhost.hostAddress || t('metrics.unknown')}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={16}>
            <Card size='small' title={t('metrics.network_interface_details')}>
              <Table
                size="small"
                dataSource={Object.entries(interfaces).map(([name, iface]: [string, any]) => ({
                  key: name,
                  name: iface.name || name,
                  displayName: iface.displayName || '未知',
                  up: iface.up || false,
                  virtual: iface.virtual || false,
                  loopback: iface.loopback || false,
                  pointToPoint: iface.pointToPoint || false,
                  mtu: iface.mtu || 0,
                  macAddress: iface.macAddress || '未知',
                  addressCount: iface.addresses ? Object.keys(iface.addresses).length : 0,
                }))}
                columns={[
                  { title: '名称', dataIndex: 'name', key: 'name' },
                  { title: '显示名称', dataIndex: 'displayName', key: 'displayName', ellipsis: true },
                  {
                    title: '状态',
                    dataIndex: 'up',
                    key: 'up',
                    render: (up: boolean) => (
                      <Badge status={up ? 'success' : 'error'} text={up ? '在线' : '离线'} />
                    )
                  },
                  {
                    title: '类型',
                    key: 'type',
                    render: (_, record: any) => (
                      <div>
                        {record.virtual && <Tag>虚拟</Tag>}
                        {record.loopback && <Tag>回环</Tag>}
                        {record.pointToPoint && <Tag>点对点</Tag>}
                      </div>
                    )
                  },
                  { title: 'MTU', dataIndex: 'mtu', key: 'mtu' },
                  { title: 'MAC地址', dataIndex: 'macAddress', key: 'macAddress', ellipsis: true },
                  { title: '地址数', dataIndex: 'addressCount', key: 'addressCount' },
                ]}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  const renderDiskInfo = () => {
    const disk = metricsData?.disk || {};
    const fileSystems = disk.fileSystems || {};

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title={t('metrics.disk_stats')}>
              <Descriptions column={1} size="small">
                <Descriptions.Item label={t('metrics.file_systems')}>{disk.totalFileSystems || 0}{t('metrics.count')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.total_space')}>{disk.totalSpace ? Math.round(disk.totalSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.available_space')}>{disk.totalUsableSpace ? Math.round(disk.totalUsableSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
                <Descriptions.Item label={t('metrics.free_space')}>{disk.totalFreeSpace ? Math.round(disk.totalFreeSpace / (1024 * 1024 * 1024)) : 0}{t('metrics.gb')}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={16}>
            <Card size='small' title={t('metrics.file_system_details')}>
              <Table
                size="small"
                dataSource={Object.entries(fileSystems).map(([name, fs]: [string, any]) => ({
                  key: name,
                  name: name || '未知',
                  type: fs.type || '未知',
                  totalSpace: fs.totalSpace ? Math.round(fs.totalSpace / (1024 * 1024 * 1024)) : 0,
                  usableSpace: fs.usableSpace ? Math.round(fs.usableSpace / (1024 * 1024 * 1024)) : 0,
                  freeSpace: fs.freeSpace ? Math.round(fs.freeSpace / (1024 * 1024 * 1024)) : 0,
                  usagePercentage: fs.totalSpace && fs.freeSpace ? Math.round((fs.totalSpace - fs.freeSpace) / fs.totalSpace * 100) : 0,
                }))}
                columns={[
                  { title: '名称', dataIndex: 'name', key: 'name' },
                  { title: '类型', dataIndex: 'type', key: 'type' },
                  { title: '总空间(GB)', dataIndex: 'totalSpace', key: 'totalSpace' },
                  { title: '可用空间(GB)', dataIndex: 'usableSpace', key: 'usableSpace' },
                  { title: '空闲空间(GB)', dataIndex: 'freeSpace', key: 'freeSpace' },
                  {
                    title: '使用率',
                    dataIndex: 'usagePercentage',
                    key: 'usagePercentage',
                    render: (percentage: number) => (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '8px', backgroundColor: token.colorFillSecondary, borderRadius: '4px' }}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: percentage > 80 ? token.colorError : percentage > 60 ? token.colorWarning : token.colorSuccess,
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                        <span>{percentage}%</span>
                      </div>
                    )
                  },
                ]}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  // 如果指定了cardKey，则只渲染单个Card
  if (cardKey) {
    return renderSingleCard(cardKey);
  }

  // 否则渲染完整的Tab内容
  switch (activeTab) {
    case 'system':
      return renderSystemInfo();
    case 'jvm':
      return renderJvmInfo();
    case 'memory':
      return renderMemoryInfo();
    case 'thread':
      return renderThreadInfo();
    case 'network':
      return renderNetworkInfo();
    case 'disk':
      return renderDiskInfo();
    default:
      return null;
  }
};

export default DetailedInfo;
