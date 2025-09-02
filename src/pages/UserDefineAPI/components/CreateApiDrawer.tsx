import React, {useEffect, useState} from "react";
import {Button, Drawer, Flex, Form, Input, Select, Space,} from "antd";
import {createApi} from "@/services/api-info.ts";
import {useTranslation} from "react-i18next";
import GraphQL from "@/pages/GraphQLAPI/components/GraphQL";
import {ApiMeta, GraphQLData} from "@/types/api-management";

interface CreateApiDrawerProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  parentId?: string | null;
  parentFolderName: string;
}

interface ApiData {
  name: string;
  method: string;
  path: string;
  parentId?: string | null;
  enabled: boolean;
  type: string;
  meta?: ApiMeta;
}

const CreateApiDrawer: React.FC<CreateApiDrawerProps> = ({
  visible,
  onClose,
  onSuccess,
  parentId,
  parentFolderName,
}) => {
  const { t } = useTranslation();
  const [createApiLoading, setCreateApiLoading] = useState(false);
  const [createApiError, setCreateApiError] = useState("");
  const [graphqlData, setGraphqlData] = useState<GraphQLData>({
    operationName: "MyQuery",
    query: "",
    variables: null,
    headers: null,
  });

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];

  const [createApiForm] = Form.useForm();

  // 重置表单和状态
  useEffect(() => {
    if (visible) {
      createApiForm.resetFields();
      setCreateApiError("");
      setGraphqlData({
        operationName: "MyQuery",
        query: "",
        variables: null,
        headers: null,
      });
    }
  }, [visible, createApiForm]);

  const handleCreateApiForm = async () => {
    const values = await createApiForm.validateFields();
    await addApi(parentId, values.name, values.method, values.path);
  };

  const addApi = async (
    parentId?: string | null,
    name?: string,
    method?: string,
    path?: string
  ) => {
    setCreateApiLoading(true);
    setCreateApiError("");
    try {
      const apiData: ApiData = {
        name: name || "",
        method: method || "GET",
        path: path || "",
        parentId: parentId,
        enabled: true,
        type: "API",
      };

      // 如果有GraphQL查询数据，添加meta.execution数据
      if (graphqlData.query) {
        apiData.meta = {
          auth: false,
          execution: {
            query: graphqlData.query,
            variables: graphqlData.variables || undefined,
            operationName: graphqlData.operationName,
            headers: graphqlData.headers || undefined,
          },
        };
      }

      await createApi(apiData);
      onSuccess();
      onClose();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t("create_failed");
      setCreateApiError(errorMessage);
    } finally {
      setCreateApiLoading(false);
    }
  };



  return (
    <Drawer
      title={t("new_api")}
      open={visible}
      onClose={onClose}
      width={"80%"}
      footer={
        <Space>
          <Button onClick={onClose}>{t("cancel")}</Button>
          <Button
            type="primary"
            onClick={handleCreateApiForm}
            loading={createApiLoading}
          >
            {t("confirm")}
          </Button>
        </Space>
      }
      bodyStyle={{
        padding: "24px",
        height: "calc(100vh - 200px)",
        overflow: "auto",
      }}
    >
      <Form
        form={createApiForm}
        layout="vertical"
        onFinish={handleCreateApiForm}
        autoComplete="off"
        style={{ height: "100%" }}
      >
        <Form.Item label={t("parent_folder")}>
          <Input
            value={parentFolderName}
            disabled
          />
        </Form.Item>
        <Form.Item
          label={t("name")}
          name="name"
          rules={[{ required: true, message: t("input_valid_msg", { name: t("name") }) }]}
        >
          <Input placeholder={t("enter_api_name")} autoFocus />
        </Form.Item>
        <Form.Item label={t("api_config")}>
          <Flex gap="small" align="center">
            <Form.Item
              name="method"
              initialValue="GET"
              rules={[{ required: true, message: t("select_request_method") }]}
              style={{ marginBottom: 0 }}
            >
              <Select options={methodOptions} style={{ width: 120 }} />
            </Form.Item>
            <Form.Item
              name="path"
              rules={[{ required: true, message: t("api_address_required") }]}
              style={{ marginBottom: 0, flex: 1 }}
            >
              <Input placeholder={t("enter_api_address")} />
            </Form.Item>
          </Flex>
        </Form.Item>

        <Form.Item label={t("graphql_query")}>
          <div
            style={{
              height: 400,
              border: "1px solid #d9d9d9",
              borderRadius: 6,
            }}
          >
            <GraphQL
              data={graphqlData}
              onChange={setGraphqlData}
            />
          </div>
        </Form.Item>

        {createApiError && (
          <div style={{ color: "red", marginTop: 8 }}>{createApiError}</div>
        )}
      </Form>
    </Drawer>
  );
};

export default CreateApiDrawer;
