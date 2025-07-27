# 代码模板库

## React 组件模板

### 1. 页面组件模板
```tsx
import React from 'react';
import { Card, theme } from 'antd';
import { getCompactPageStyle, getCompactCardStyle } from '@/utils/theme';

interface PageProps {
  title?: string;
  children?: React.ReactNode;
}

const PageComponent: React.FC<PageProps> = ({ title, children }) => {
  const { token } = theme.useToken();
  
  return (
    <div style={getCompactPageStyle(token)}>
      <Card 
        title={title}
        style={getCompactCardStyle(token)}
      >
        {children}
      </Card>
    </div>
  );
};

export default PageComponent;
```

### 2. 表单组件模板
```tsx
import React from 'react';
import { Form, Input, Button, Space, theme } from 'antd';
import { getCompactFormStyle } from '@/utils/theme';

interface FormData {
  name: string;
  description?: string;
}

interface FormComponentProps {
  onSubmit: (values: FormData) => void;
  initialValues?: Partial<FormData>;
}

const FormComponent: React.FC<FormComponentProps> = ({ 
  onSubmit, 
  initialValues 
}) => {
  const { token } = theme.useToken();
  const [form] = Form.useForm();

  const handleSubmit = (values: FormData) => {
    onSubmit(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      style={getCompactFormStyle(token)}
      initialValues={initialValues}
      onFinish={handleSubmit}
    >
      <Form.Item
        label="名称"
        name="name"
        rules={[{ required: true, message: '请输入名称' }]}
      >
        <Input placeholder="请输入名称" />
      </Form.Item>
      
      <Form.Item
        label="描述"
        name="description"
      >
        <Input.TextArea placeholder="请输入描述" />
      </Form.Item>
      
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default FormComponent;
```

### 3. 表格组件模板
```tsx
import React, { useState, useEffect } from 'react';
import { Table, Button, Space, theme } from 'antd';
import { getCompactTableStyle } from '@/utils/theme';

interface TableItem {
  id: string;
  name: string;
  status: string;
  createTime: string;
}

interface TableComponentProps {
  data: TableItem[];
  loading?: boolean;
  onEdit?: (record: TableItem) => void;
  onDelete?: (id: string) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({
  data,
  loading = false,
  onEdit,
  onDelete
}) => {
  const { token } = theme.useToken();

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: TableItem) => (
        <Space size={token.marginXS}>
          <Button 
            type="link" 
            size="small"
            onClick={() => onEdit?.(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            size="small" 
            danger
            onClick={() => onDelete?.(record.id)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey="id"
      style={getCompactTableStyle(token)}
      pagination={{
        size: 'small',
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  );
};

export default TableComponent;
```

### 4. 自定义Hook模板
```tsx
import { useState, useEffect, useCallback } from 'react';

interface UseDataOptions<T> {
  fetchData: () => Promise<T[]>;
  dependencies?: any[];
}

interface UseDataReturn<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

export function useData<T>({ 
  fetchData, 
  dependencies = [] 
}: UseDataOptions<T>): UseDataReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await fetchData();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载数据失败');
    } finally {
      setLoading(false);
    }
  }, [fetchData]);

  const refresh = useCallback(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, dependencies);

  return { data, loading, error, refresh };
}
```

### 5. API服务模板
```tsx
import { api } from '@/utils/api';

// 数据类型定义
export interface Job {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  createTime: string;
  updateTime: string;
}

export interface CreateJobRequest {
  name: string;
  description?: string;
}

export interface UpdateJobRequest {
  name?: string;
  description?: string;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// API服务类
export class JobService {
  // 获取任务列表
  static async getJobs(page = 1, pageSize = 10): Promise<PagedResult<Job>> {
    return api.get('/jobs', { params: { page, pageSize } });
  }

  // 获取单个任务
  static async getJob(id: string): Promise<Job> {
    return api.get(`/jobs/${id}`);
  }

  // 创建任务
  static async createJob(data: CreateJobRequest): Promise<Job> {
    return api.post('/jobs', data);
  }

  // 更新任务
  static async updateJob(id: string, data: UpdateJobRequest): Promise<Job> {
    return api.put(`/jobs/${id}`, data);
  }

  // 删除任务
  static async deleteJob(id: string): Promise<void> {
    return api.delete(`/jobs/${id}`);
  }
}
```

### 6. xyflow/react 图表模板
```tsx
import React, { useState, useCallback } from 'react';
import { ReactFlow, 
  Node, 
  Edge, 
  Controls, 
  Background,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface ERNode extends Node {
  data: {
    label: string;
    fields: Array<{
      name: string;
      type: string;
      isPrimary?: boolean;
    }>;
  };
}

const ERDiagram: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<ERNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div style={{ width: '100%', height: '600px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
};

export default ERDiagram;
```

## 样式工具函数模板

### 紧凑主题样式函数
```tsx
import { ThemeToken } from 'antd/es/theme/interface';

// 页面容器样式
export const getCompactPageStyle = (token: ThemeToken) => ({
  padding: token.padding,
  minHeight: '100vh',
  backgroundColor: token.colorBgContainer,
});

// 卡片容器样式
export const getCompactCardStyle = (token: ThemeToken) => ({
  borderRadius: token.borderRadius,
  boxShadow: token.boxShadow,
});

// 表单容器样式
export const getCompactFormStyle = (token: ThemeToken) => ({
  maxWidth: '600px',
  margin: '0 auto',
});

// 表格容器样式
export const getCompactTableStyle = (token: ThemeToken) => ({
  borderRadius: token.borderRadius,
});
``` 