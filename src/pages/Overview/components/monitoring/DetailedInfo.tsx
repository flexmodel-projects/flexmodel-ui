import React from 'react';
import {Badge, Card, Col, Descriptions, Row, Table, Tag} from 'antd';

interface DetailedInfoProps {
  activeTab: string;
  metricsData: any;
}

const DetailedInfo: React.FC<DetailedInfoProps> = ({ activeTab, metricsData }) => {
  if (!metricsData) return null;

  const renderSystemInfo = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card size="small" title="CPU信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="进程CPU使用率">{Math.round(metricsData.cpu.processCpuLoad * 100)}%</Descriptions.Item>
              <Descriptions.Item label="系统CPU使用率">{Math.round(metricsData.cpu.systemCpuLoad * 100)}%</Descriptions.Item>
              <Descriptions.Item label="可用处理器">{metricsData.cpu.availableProcessors}个</Descriptions.Item>
              <Descriptions.Item label="系统架构">{metricsData.cpu.architecture}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="内存信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="总物理内存">{Math.round(metricsData.cpu.totalPhysicalMemorySize / (1024 * 1024 * 1024))}GB</Descriptions.Item>
              <Descriptions.Item label="空闲物理内存">{Math.round(metricsData.cpu.freePhysicalMemorySize / (1024 * 1024 * 1024))}GB</Descriptions.Item>
              <Descriptions.Item label="总交换空间">{Math.round(metricsData.cpu.totalSwapSpaceSize / (1024 * 1024 * 1024))}GB</Descriptions.Item>
              <Descriptions.Item label="空闲交换空间">{Math.round(metricsData.cpu.freeSwapSpaceSize / (1024 * 1024 * 1024))}GB</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="系统信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="操作系统">{metricsData.cpu.name}</Descriptions.Item>
              <Descriptions.Item label="系统版本">{metricsData.cpu.version}</Descriptions.Item>
              <Descriptions.Item label="系统负载">{metricsData.cpu.systemLoadAverage > 0 ? metricsData.cpu.systemLoadAverage.toFixed(2) : 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="运行时间">{Math.round(metricsData.jvm.uptime / 1000 / 60)}分钟</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" title="JVM信息">
            <Descriptions column={1} size="small">
              <Descriptions.Item label="JVM名称">{metricsData.jvm.name}</Descriptions.Item>
              <Descriptions.Item label="JVM版本">{metricsData.jvm.version}</Descriptions.Item>
              <Descriptions.Item label="JVM厂商">{metricsData.jvm.vendor}</Descriptions.Item>
              <Descriptions.Item label="已加载类">{metricsData.jvm.loadedClassCount}个</Descriptions.Item>
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
            <Card size="small" title="JVM基本信息">
              <Descriptions column={2} size="small">
                <Descriptions.Item label="JVM名称">{jvm.name || '未知'}</Descriptions.Item>
                <Descriptions.Item label="JVM版本">{jvm.version || '未知'}</Descriptions.Item>
                <Descriptions.Item label="JVM厂商">{jvm.vendor || '未知'}</Descriptions.Item>
                <Descriptions.Item label="运行时间">{jvm.uptime ? Math.round(jvm.uptime / 1000 / 60) : 0} 分钟</Descriptions.Item>
                <Descriptions.Item label="启动时间">{jvm.startTime ? new Date(jvm.startTime).toLocaleString() : '未知'}</Descriptions.Item>
                <Descriptions.Item label="已加载类">{jvm.loadedClassCount || 0}</Descriptions.Item>
                <Descriptions.Item label="总加载类">{jvm.totalLoadedClassCount || 0}</Descriptions.Item>
                <Descriptions.Item label="已卸载类">{jvm.unloadedClassCount || 0}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={5}>
            <Card size="small" title="系统属性">
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
            <Card size="small" title="垃圾收集器">
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
            <Card size="small" title="堆内存">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="初始大小">{heap.init ? Math.round(heap.init / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="已使用">{heap.used ? Math.round(heap.used / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="已提交">{heap.committed ? Math.round(heap.committed / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="最大大小">{heap.max ? Math.round(heap.max / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="使用率">{Math.round(heap.usagePercentage || 0)}%</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="非堆内存">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="初始大小">{nonHeap.init ? Math.round(nonHeap.init / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="已使用">{nonHeap.used ? Math.round(nonHeap.used / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="已提交">{nonHeap.committed ? Math.round(nonHeap.committed / (1024 * 1024)) : 0}MB</Descriptions.Item>
                <Descriptions.Item label="最大大小">{nonHeap.max === -1 ? '无限制' : nonHeap.max ? Math.round(nonHeap.max / (1024 * 1024)) + 'MB' : '0MB'}</Descriptions.Item>
                <Descriptions.Item label="使用率">{Math.round(nonHeap.usagePercentage || 0)}%</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
        </Row>

        <Card size="small" title="内存池详情">
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
                    <div style={{ width: '60px', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: '100%',
                          backgroundColor: percentage > 80 ? '#ff4d4f' : percentage > 60 ? '#faad14' : '#52c41a',
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
            <Card size="small" title="线程统计">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="当前线程数">{threads.threadCount || 0}个</Descriptions.Item>
                <Descriptions.Item label="峰值线程数">{threads.peakThreadCount || 0}个</Descriptions.Item>
                <Descriptions.Item label="守护线程数">{threads.daemonThreadCount || 0}个</Descriptions.Item>
                <Descriptions.Item label="已启动线程数">{threads.totalStartedThreadCount || 0}个</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" title="线程状态">
              {Object.entries(threadStates).map(([state, count]: [string, any]) => (
                <div key={state} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <Tag color={state === 'RUNNABLE' ? 'green' : state === 'WAITING' ? 'orange' : state === 'BLOCKED' ? 'red' : 'default'}>
                    {state}
                  </Tag>
                  <span>{count} 个</span>
                </div>
              ))}
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="线程详情">
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
            <Card size="small" title="网络统计">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="总接口数">{network.totalInterfaces || 0}个</Descriptions.Item>
                <Descriptions.Item label="活跃接口数">{stats.activeInterfaces || 0}个</Descriptions.Item>
                <Descriptions.Item label="主机名">{localhost.hostName || '未知'}</Descriptions.Item>
                <Descriptions.Item label="主机地址">{localhost.hostAddress || '未知'}</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={16}>
            <Card size="small" title="网络接口详情">
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
            <Card size="small" title="磁盘统计">
              <Descriptions column={1} size="small">
                <Descriptions.Item label="文件系统数">{disk.totalFileSystems || 0}个</Descriptions.Item>
                <Descriptions.Item label="总空间">{disk.totalSpace ? Math.round(disk.totalSpace / (1024 * 1024 * 1024)) : 0}GB</Descriptions.Item>
                <Descriptions.Item label="可用空间">{disk.totalUsableSpace ? Math.round(disk.totalUsableSpace / (1024 * 1024 * 1024)) : 0}GB</Descriptions.Item>
                <Descriptions.Item label="空闲空间">{disk.totalFreeSpace ? Math.round(disk.totalFreeSpace / (1024 * 1024 * 1024)) : 0}GB</Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>
          <Col span={16}>
            <Card size="small" title="文件系统详情">
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
                        <div style={{ width: '60px', height: '8px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              backgroundColor: percentage > 80 ? '#ff4d4f' : percentage > 60 ? '#faad14' : '#52c41a',
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
