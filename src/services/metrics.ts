import {api} from '@/utils/request'

// 基础类型定义
export interface MemoryInfo {
  init: number
  used: number
  committed: number
  max: number
  usagePercentage: number
}

export interface MemoryPoolInfo extends MemoryInfo {
  type: string
  memoryManagerNames: string
}

export interface GarbageCollectorInfo {
  collectionCount: number
  collectionTime: number
}

export interface FileSystemStatsInfo {
  totalSpace: number
  freeSpace: number
  usableSpace: number
  lastModified: number
  spaceUtilization: number
}

export interface ProcessIoInfo {
  committedVirtualMemoryMB: number
}

export interface JvmIoInfo {
  maxMemory: number
  totalMemory: number
  freeMemory: number
  usedMemory: number
}

export interface DiskIoInfo {
  committedVirtualMemorySize: number
  processIo: ProcessIoInfo
  fileSystemStats: FileSystemStatsInfo
  jvmIo: JvmIoInfo
  error?: string
  fileSystemError?: string
}

export interface FileSystemInfo {
  name: string | null
  type: string | null
  totalSpace: number
  usedSpace: number
  freeSpace: number
  usableSpace: number
  usagePercentage: number
  totalSpaceGB: number
  usedSpaceGB: number
  usableSpaceGB: number
  freeSpaceGB: number
  lastModified: number | null
  readOnly: boolean
}

export interface LocalhostInfo {
  hostName: string
  hostAddress: string
  canonicalHostName: string
  linkLocalAddress: boolean
  multicastAddress: boolean
  loopbackAddress: boolean
  siteLocalAddress: boolean
}

export interface NetworkStatsInfo {
  activeInterfaces: number
  timestamp: number
}

export interface NetworkAddressInfo {
  address: string
  hostName: string
  networkPrefixLength: number
  broadcast: string | null
}

export interface NetworkInterfaceInfo {
  name: string
  displayName: string
  supportsMulticast: boolean
  macAddress: string | null
  mtu: number
  addresses: Record<string, NetworkAddressInfo>
  parent: string | null
  subInterfaces: Record<string, NetworkInterfaceInfo>
  virtual: boolean
  up: boolean
  loopback: boolean
  pointToPoint: boolean
}

export interface ThreadDetailInfo {
  name: string
  state: string
  blockedTime: number
  blockedCount: number
  waitedTime: number
  waitedCount: number
  cpuTime: number
  userTime: number
  lockName: string | null
  lockOwnerName: string | null
}

// 主要响应类型
export interface CpuMetricsResponse {
  availableProcessors: number
  architecture: string
  name: string
  version: string
  systemCpuLoad: number
  processCpuLoad: number
  systemLoadAverage: number
  totalPhysicalMemorySize: number
  freePhysicalMemorySize: number
  totalSwapSpaceSize: number
  freeSwapSpaceSize: number
  committedVirtualMemorySize: number
  maxMemory: number
  totalMemory: number
  freeMemory: number
  usedMemory: number
}

export interface JvmMetricsResponse {
  name: string
  version: string
  vendor: string
  uptime: number
  startTime: number
  loadedClassCount: number
  totalLoadedClassCount: number
  unloadedClassCount: number
  garbageCollectors: Record<string, GarbageCollectorInfo>
  systemProperties: Record<string, string>
}

export interface MemoryMetricsResponse {
  heap: MemoryInfo
  nonHeap: MemoryInfo
  memoryPools: Record<string, MemoryPoolInfo>
}

export interface DiskMetricsResponse {
  fileSystems: Record<string, FileSystemInfo>
  rootDirectory: FileSystemInfo
  totalFileSystems: number
  totalSpace: number
  totalUsableSpace: number
  totalFreeSpace: number
  diskIo: DiskIoInfo
}

export interface NetworkMetricsResponse {
  interfaces: Record<string, NetworkInterfaceInfo>
  totalInterfaces: number
  localhost: LocalhostInfo
  stats: NetworkStatsInfo
  localhostError?: string
}

export interface ThreadMetricsResponse {
  threadCount: number
  peakThreadCount: number
  daemonThreadCount: number
  totalStartedThreadCount: number
  currentThreadCpuTime: number
  currentThreadUserTime: number
  threadStates: Record<string, number>
  threadDetails: Record<string, ThreadDetailInfo>
}

export interface PrometheusMetricsResponse {
  metrics: string
  error?: string
}

export interface SystemSummaryResponse {
  systemTime: number
  uptime: number
  availableProcessors: number
  osName: string
  osVersion: string
  osArch: string
  heapUsedMB: number
  heapMaxMB: number
  heapUsagePercentage: number
  threadCount: number
  peakThreadCount: number
  daemonThreadCount: number
  diskTotalSpaceGB: number
  diskUsableSpaceGB: number
  diskFreeSpaceGB: number
  diskUsagePercentage: number
  totalNetworkInterfaces: number
  upNetworkInterfaces: number
  hostName: string
  hostAddress: string
  networkError?: string
  jvmName: string
  jvmVersion: string
  jvmVendor: string
  loadedClassCount: number
  totalLoadedClassCount: number
  totalGcCount: number
  totalGcTime: number
  systemCpuLoad: number
  processCpuLoad: number
}

export interface AllMetricsResponse {
  jvm: JvmMetricsResponse
  cpu: CpuMetricsResponse
  memory: MemoryMetricsResponse
  threads: ThreadMetricsResponse
  disk: DiskMetricsResponse
  network: NetworkMetricsResponse
  summary: SystemSummaryResponse
  prometheus: PrometheusMetricsResponse
  timestamp: number
  processingTimeMs: number
  error?: string
}

/**
 * 获取所有监控指标
 */
export const getAllMetrics = (): Promise<AllMetricsResponse> => {
  return api.get('/metrics/all')
}

/**
 * 获取CPU监控信息
 */
export const getCpuMetrics = (): Promise<CpuMetricsResponse> => {
  return api.get('/metrics/cpu')
}

/**
 * 获取JVM监控信息
 */
export const getJvmMetrics = (): Promise<JvmMetricsResponse> => {
  return api.get('/metrics/jvm')
}

/**
 * 获取内存监控信息
 */
export const getMemoryMetrics = (): Promise<MemoryMetricsResponse> => {
  return api.get('/metrics/memory')
}

/**
 * 获取磁盘监控信息
 */
export const getDiskMetrics = (): Promise<DiskMetricsResponse> => {
  return api.get('/metrics/disk')
}

/**
 * 获取网络监控信息
 */
export const getNetworkMetrics = (): Promise<NetworkMetricsResponse> => {
  return api.get('/metrics/network')
}

/**
 * 获取线程监控信息
 */
export const getThreadMetrics = (): Promise<ThreadMetricsResponse> => {
  return api.get('/metrics/threads')
}

/**
 * 获取Prometheus格式指标
 */
export const getPrometheusMetrics = (): Promise<PrometheusMetricsResponse> => {
  return api.get('/metrics/prometheus')
}

/**
 * 获取系统摘要信息
 */
export const getSystemSummary = (): Promise<SystemSummaryResponse> => {
  return api.get('/metrics/summary')
}
