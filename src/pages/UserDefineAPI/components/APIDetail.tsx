import React from "react";
import {Badge, Card, Descriptions, Divider, Space, Tag, theme, Typography} from "antd";
import {ApiDefinition} from "@/types/api-management";
import {useTranslation} from "react-i18next";

const { Title, Text } = Typography;

interface APIDetailProps {
  data: ApiDefinition | undefined;
}

const APIDetail: React.FC<APIDetailProps> = ({ data }: APIDetailProps) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [cardHeight, setCardHeight] = React.useState<number>();

  const updateCardHeight = React.useCallback(() => {
    if (!containerRef.current) {
      return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const availableHeight = window.innerHeight - rect.top - token.padding;
    if (availableHeight > 0) {
      setCardHeight(availableHeight);
    } else {
      setCardHeight(undefined);
    }
  }, [token.padding]);

  React.useEffect(() => {
    if (!data) {
      return;
    }

    updateCardHeight();
    window.addEventListener("resize", updateCardHeight);
    return () => {
      window.removeEventListener("resize", updateCardHeight);
    };
  }, [data, updateCardHeight]);

  if (!data) {
    return (
      <Card className="h-full">
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          {t("api_detail.select_api_to_view")}
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

  const renderVariables = (variables: Record<string, any> | string | null | undefined) => {
    if (variables === null || variables === undefined) {
      return <Text type="secondary">{t("api_detail.none")}</Text>;
    }

    if (typeof variables === "string") {
      const trimmed = variables.trim();
      if (!trimmed) {
        return <Text type="secondary">{t("api_detail.none")}</Text>;
      }
      try {
        const parsed = JSON.parse(trimmed);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed) && Object.keys(parsed).length === 0) {
          return <Text type="secondary">{t("api_detail.none")}</Text>;
        }
        return (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(parsed, null, 2)}
            </pre>
          </div>
        );
      } catch {
        return (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {trimmed}
            </pre>
          </div>
        );
      }
    }

    if (Object.keys(variables).length === 0) {
      return <Text type="secondary">{t("api_detail.none")}</Text>;
    }

    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {JSON.stringify(variables, null, 2)}
        </pre>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="h-full flex flex-col" style={{ minHeight: 0 }}>
      <Card
        className="h-full"
        style={{
          height: cardHeight ? `${cardHeight}px` : "100%",
          display: "flex",
          flexDirection: "column",
        }}
        bodyStyle={{
          padding: "24px",
          overflow: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        <div className="space-y-6">
          {/* API 基本信息 */}
          <div>
            <Title level={3} className="mb-4 text-gray-800 dark:text-gray-200">
              {data.name}
            </Title>

            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={t("api_detail.api_id")}>
                <Text code>{data.id}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.status")}>
                <Badge
                  status={data.enabled ? "success" : "error"}
                  text={data.enabled ? t("api_detail.enabled") : t("api_detail.disabled")}
                />
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.request_method")}>
                <Tag color={getMethodColor(data.method || '')}>{data.method}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.request_path")}>
                <Text code>{data.path}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.api_type")}>
                <Tag>{data.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.parent_id")}>
                <Text code>{data.parentId}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.created_by")}>
                <Text>{data.createdBy || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.updated_by")}>
                <Text>{data.updatedBy || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.created_at")}>
                <Text>{data.createdAt || "-"}</Text>
              </Descriptions.Item>
              <Descriptions.Item label={t("api_detail.updated_at")}>
                <Text>{data.updatedAt || "-"}</Text>
              </Descriptions.Item>
            </Descriptions>
          </div>

          <Divider />

          {/* 认证与权限 */}
          <div>
            <Title level={4} className="mb-3 text-gray-800 dark:text-gray-200">{t("api_detail.auth_and_permissions")}</Title>
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label={t("api_detail.requires_auth")}>
                <Badge
                  status={data.meta.auth ? "warning" : "success"}
                  text={data.meta.auth ? t("api_detail.yes") : t("api_detail.no")}
                />
              </Descriptions.Item>
              {data.meta.identityProvider && (
                <Descriptions.Item label={t("api_detail.identity_provider")}>
                  <Text>{data.meta.identityProvider}</Text>
                </Descriptions.Item>
              )}
              <Descriptions.Item label={t("api_detail.rate_limiting_enabled")}>
                <Badge
                  status={data.meta.rateLimitingEnabled ? "warning" : "default"}
                  text={data.meta.rateLimitingEnabled ? t("api_detail.yes") : t("api_detail.no")}
                />
              </Descriptions.Item>
              {data.meta.rateLimitingEnabled && (
                <>
                  <Descriptions.Item label={t("api_detail.max_request_count")}>
                    <Text>{data.meta.maxRequestCount || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label={t("api_detail.interval_in_seconds")} span={2}>
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
                <Title level={4} className="mb-3 text-gray-800 dark:text-gray-200">{t("api_detail.execution_config")}</Title>

                <div className="space-y-4">
                  {data.meta.execution.operationName && (
                    <div>
                      <Text strong className="block mb-2 text-gray-800 dark:text-gray-200">{t("api_detail.operation_name")}:</Text>
                      <Text code>{data.meta.execution.operationName}</Text>
                    </div>
                  )}

                  {data.meta.execution.query && (
                    <div>
                      <Text strong className="block mb-2 text-gray-800 dark:text-gray-200">{t("api_detail.query_statement")}:</Text>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                        <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {data.meta.execution.query}
                        </pre>
                      </div>
                    </div>
                  )}

                  <div>
                    <Text strong className="block mb-2 text-gray-800 dark:text-gray-200">{t("api_detail.variables")}:</Text>
                    {renderVariables(data.meta.execution.variables || {})}
                  </div>

                  {data.meta.execution.headers && Object.keys(data.meta.execution.headers).length > 0 && (
                    <div>
                      <Text strong className="block mb-2 text-gray-800 dark:text-gray-200">{t("api_detail.headers")}:</Text>
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
                <Title level={4} className="mb-3 text-gray-800 dark:text-gray-200">{t("api_detail.children")} ({data.children.length})</Title>
                <Space direction="vertical" className="w-full">
                  {data.children.map((child) => (
                    <Card key={child.id} size="small" className="bg-gray-50 dark:bg-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <Text strong className="text-gray-800 dark:text-gray-200">{child.name}</Text>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            <Tag color={getMethodColor(child.method || '')}>
                              {child.method}
                            </Tag>
                            <Text code className="ml-2">{child.path}</Text>
                          </div>
                        </div>
                        <Badge
                          status={child.enabled ? "success" : "error"}
                          text={child.enabled ? t("api_detail.enable") : t("api_detail.disable")}
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
    </div>
  );
};

export default APIDetail;
