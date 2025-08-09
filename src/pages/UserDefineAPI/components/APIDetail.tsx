import React from "react";
import {Badge, Card, Descriptions, Divider, Space, Tag, Typography} from "antd";
import {ApiDefinition} from "@/types/api-management";

const { Title, Text } = Typography;

interface APIDetailProps {
  data: ApiDefinition | undefined;
}

const APIDetail: React.FC<APIDetailProps> = ({ data }: APIDetailProps) => {
  if (!data) {
    return (
      <Card className="h-full">
        <div className="flex items-center justify-center h-full text-gray-500">
          请选择一个 API 以查看详情
        </div>
      </Card>
    );
  }

  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'green',
      POST: 'blue',
      PUT: 'orange',
      DELETE: 'red',
      PATCH: 'purple'
    };
    return colors[method as keyof typeof colors] || 'default';
  };

  const renderVariables = (variables: Record<string, any>) => {
    if (!variables || Object.keys(variables).length === 0) {
      return <Text type="secondary">无</Text>;
    }

    return (
      <div className="bg-gray-50 p-3 rounded-md">
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">
          {JSON.stringify(variables, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <Card className="h-full" bodyStyle={{ padding: '24px', height: '100%', overflow: 'auto' }}>
      <div className="space-y-6">
        {/* API 基本信息 */}
        <div>
          <Title level={3} className="mb-4 text-gray-800">
            {data.name}
          </Title>

          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="API ID">
              <Text code>{data.id}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Badge
                status={data.enabled ? "success" : "error"}
                text={data.enabled ? "已启用" : "已禁用"}
              />
            </Descriptions.Item>
            <Descriptions.Item label="请求方法">
              <Tag color={getMethodColor(data.method || '')}>{data.method}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="请求路径">
              <Text code>{data.path}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="API 类型">
              <Tag>{data.type}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="父级 ID">
              <Text code>{data.parentId}</Text>
            </Descriptions.Item>
          </Descriptions>
        </div>

        <Divider />

        {/* 认证与权限 */}
        <div>
          <Title level={4} className="mb-3">认证与权限</Title>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="需要认证">
              <Badge
                status={data.meta.auth ? "warning" : "success"}
                text={data.meta.auth ? "是" : "否"}
              />
            </Descriptions.Item>
            {data.meta.identityProvider && (
              <Descriptions.Item label="身份提供商">
                <Text>{data.meta.identityProvider}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="限流启用">
              <Badge
                status={data.meta.rateLimitingEnabled ? "warning" : "default"}
                text={data.meta.rateLimitingEnabled ? "是" : "否"}
              />
            </Descriptions.Item>
            {data.meta.rateLimitingEnabled && (
              <>
                <Descriptions.Item label="最大请求数">
                  <Text>{data.meta.maxRequestCount || 'N/A'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="间隔时间(秒)" span={2}>
                  <Text>{data.meta.intervalInSeconds || 'N/A'}</Text>
                </Descriptions.Item>
              </>
            )}
          </Descriptions>
        </div>

        {/* 执行配置 */}
        {data.meta.execution && (
          <>
            <Divider />
            <div>
              <Title level={4} className="mb-3">执行配置</Title>

              <div className="space-y-4">
                {data.meta.execution.operationName && (
                  <div>
                    <Text strong className="block mb-2">操作名称:</Text>
                    <Text code>{data.meta.execution.operationName}</Text>
                  </div>
                )}

                {data.meta.execution.query && (
                  <div>
                    <Text strong className="block mb-2">查询语句:</Text>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                        {data.meta.execution.query}
                      </pre>
                    </div>
                  </div>
                )}

                <div>
                  <Text strong className="block mb-2">变量:</Text>
                  {renderVariables(data.meta.execution.variables || {})}
                </div>

                {data.meta.execution.headers && Object.keys(data.meta.execution.headers).length > 0 && (
                  <div>
                    <Text strong className="block mb-2">请求头:</Text>
                    {renderVariables(data.meta.execution.headers)}
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* 子项信息 */}
        {data.children && data.children.length > 0 && (
          <>
            <Divider />
            <div>
              <Title level={4} className="mb-3">子项 ({data.children.length})</Title>
              <Space direction="vertical" className="w-full">
                {data.children.map((child) => (
                  <Card key={child.id} size="small" className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <Text strong>{child.name}</Text>
                        <div className="text-sm text-gray-500 mt-1">
                          <Tag color={getMethodColor(child.method || '')}>
                            {child.method}
                          </Tag>
                          <Text code className="ml-2">{child.path}</Text>
                        </div>
                      </div>
                      <Badge
                        status={child.enabled ? "success" : "error"}
                        text={child.enabled ? "启用" : "禁用"}
                      />
                    </div>
                  </Card>
                ))}
              </Space>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default APIDetail;
