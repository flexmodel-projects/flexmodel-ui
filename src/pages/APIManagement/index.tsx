import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Dropdown,
  Flex,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Splitter,
  Switch,
  Tabs,
  TabsProps,
  Typography,
} from "antd";
import {
  MoreOutlined,
  PlusOutlined,
  SaveOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  createApi,
  deleteApi,
  getApis,
  updateApi,
  updateApiName,
  updateApiStatus,
} from "@/services/api-info.ts";
import styles from "./index.module.scss";
import GraphQL from "./components/GraphQL.tsx";
import Authorization from "./components/Authorization.tsx";
import { useTranslation } from "react-i18next";
import { ApiDefinition, GraphQLData, TreeNode } from "@/types/api-management";
import BatchCreate from "./components/BatchCreate.tsx";
import { useConfig } from "@/store/appStore.ts";
import Tree from "@/components/explore/explore/Tree.jsx";
import {
  ApiFolder,
  ApiMethodDelete,
  ApiMethodGet,
  ApiMethodPatch,
  ApiMethodPost,
  ApiMethodPut,
  IconFile,
  IconFolder,
} from "@/components/explore/icons/Icons.jsx";

const ApiManagement: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useConfig();

  // 状态定义
  const [apiList, setApiList] = useState<ApiDefinition[]>([]);
  const [batchCreateDialogDrawer, setBatchCreateDrawerVisible] =
    useState<boolean>(false);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editForm, setEditForm] = useState<ApiDefinition | null>(null);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameTarget, setRenameTarget] = useState<any>(null);

  // 新建接口弹窗逻辑
  const [createApiDialogVisible, setCreateApiDialogVisible] = useState(false);
  const [createApiParentId, setCreateApiParentId] = useState<string | null>(
    null
  );
  const [createApiLoading, setCreateApiLoading] = useState(false);
  const [createApiError, setCreateApiError] = useState("");

  // 新建文件夹弹窗逻辑
  const [createFolderDialogVisible, setCreateFolderDialogVisible] =
    useState(false);
  const [createFolderName, setCreateFolderName] = useState("");
  const [createFolderParentId, setCreateFolderParentId] = useState<
    string | null
  >(null);
  const [createFolderLoading, setCreateFolderLoading] = useState(false);
  const [createFolderError, setCreateFolderError] = useState("");

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];

  // 新建接口弹窗表单实例
  const [createApiForm] = Form.useForm();

  useEffect(() => {
    if (selectedNode?.data) {
      // 确保graphql字段存在，如果不存在则初始化为空对象
      let graphqlData: GraphQLData = selectedNode.data.graphql || {
        operationName: "MyQuery",
        query: "",
        variables: null,
        headers: null,
      };

      // 如果选中的是API类型且有meta.execution数据，则使用meta.execution的内容
      if (
        selectedNode.data.type === "API" &&
        selectedNode.data.meta?.execution
      ) {
        const execution = selectedNode.data.meta.execution;
        graphqlData = {
          operationName: execution.operationName || "MyQuery",
          query: execution.query || "",
          variables: execution.variables || null,
          headers: execution.headers || null,
        };
      }

      const data: ApiDefinition = {
        id: selectedNode.data.id || "",
        name: selectedNode.data.name || "",
        parentId: selectedNode.data.parentId || null,
        type: selectedNode.data.type || "",
        method: selectedNode.data.method || "",
        path: selectedNode.data.path || "",
        children: selectedNode.data.children || [],
        data: selectedNode.data.data || {},
        meta: selectedNode.data.meta || {},
        enabled: selectedNode.data.enabled ?? true,
        graphql: graphqlData,
      };
      setEditForm(data);
    }
  }, [selectedNode]);

  // 移除空的useEffect，避免不必要的渲染

  // 请求 API 列表数据
  useEffect(() => {
    reqApiList().then((apis) => {
      const getDefaultSelectedApi = (apis: any): any => {
        for (const api of apis) {
          if (api.type === "API") {
            return api;
          }
          if (api.children) {
            const result: any = getDefaultSelectedApi(api.children);
            if (result) return result;
          }
        }
        return null;
      };

      const defaultApi = getDefaultSelectedApi(apis);
      if (defaultApi) {
        setSelectedNode({
          children: [],
          data: defaultApi,
          isLeaf: true,
          key: defaultApi.id,
          settingVisible: false,
          title: defaultApi.name,
        });
      }
    });
  }, []);

  const reqApiList = async () => {
    const apis = await getApis();
    setApiList(apis);
    return apis;
  };

  const showDeleteConfirm = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      setDeleteLoading(true);
      try {
        await deleteApi(deleteTarget.id);
        message.success(t("delete_success"));
        reqApiList();
        setDeleteConfirmVisible(false);
      } catch {
        message.error(t("delete_failed"));
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const showEditInput = (data: ApiDefinition) => {
    setRenameTarget(data);
    setRenameValue(data.name);
    setRenameDialogVisible(true);
  };

  const renameApi = async (name: string) => {
    if (renameTarget) {
      await updateApiName(renameTarget.id, name);
      message.success(t("rename_success"));
      reqApiList();
    }
  };

  const showCreateApiDialog = (parentId?: string | null) => {
    setCreateApiParentId(parentId || null);
    setCreateApiDialogVisible(true);
    setCreateApiError("");
    createApiForm.resetFields();
  };

  const handleCreateApiForm = async () => {
    const values = await createApiForm.validateFields();
    await addApi(createApiParentId, values.name, values.method, values.path);
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
      await createApi({
        name: name || "",
        method: method || "GET",
        path: path || "",
        parentId: parentId,
        enabled: true,
        type: "API",
      });
      message.success(t("create_success"));
      setCreateApiDialogVisible(false);
      reqApiList();
    } catch (error: any) {
      setCreateApiError(error.message || t("create_failed"));
    } finally {
      setCreateApiLoading(false);
    }
  };

  const addFolder = async (parentId?: string | null) => {
    if (!createFolderName.trim()) {
      setCreateFolderError(t("folder_name_required"));
      return;
    }
    setCreateFolderLoading(true);
    setCreateFolderError("");
    try {
      await createApi({
        name: createFolderName,
        parentId: parentId,
        type: "FOLDER",
      });
      message.success(t("create_success"));
      setCreateFolderDialogVisible(false);
      setCreateFolderName("");
      reqApiList();
    } catch (error: any) {
      setCreateFolderError(error.message || t("create_failed"));
    } finally {
      setCreateFolderLoading(false);
    }
  };

  const showCreateFolderDialog = (parentId?: string | null) => {
    setCreateFolderParentId(parentId || null);
    setCreateFolderDialogVisible(true);
    setCreateFolderName("");
    setCreateFolderError("");
  };

  const handleCreateFolder = async () => {
    await addFolder(createFolderParentId);
  };

  function convertApiListToTreeData(list: any[]): any[] {
    return list.map((item) => ({
      path: item.id,
      filename: item.name,
      type: item.type === "FOLDER" ? "folder" : "file",
      data: item,
      children: item.children ? convertApiListToTreeData(item.children) : [],
    }));
  }

  // 根据ID获取上级目录名称
  const getParentFolderName = (parentId: string | null): string => {
    if (!parentId) return "根目录";

    const findFolder = (
      apis: ApiDefinition[],
      targetId: string
    ): ApiDefinition | null => {
      for (const api of apis) {
        if (api.id === targetId) {
          return api;
        }
        if (api.children) {
          const found = findFolder(api.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const parent = findFolder(apiList, parentId);
    return parent ? parent.name : "未知目录";
  };

  const handleSaveApi = async () => {
    if (editForm) {
      // 构造保存数据，确保包含parentId
      const saveData = {
        name: editForm.name,
        method: editForm.method,
        path: editForm.path || "",
        parentId: editForm.parentId,
        enabled: editForm.enabled,
        type: editForm.type,
        meta: editForm.meta,
        graphql: editForm.graphql,
      };

      await updateApi(editForm.id, saveData);
      message.success(t("form_save_success"));
      reqApiList();
    }
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "graphql",
      label: "GraphQL",
      className: "h-full",
      children: (
        <GraphQL
          data={editForm?.graphql}
          onChange={(data) => {
            setEditForm((prev) => (prev ? { ...prev, graphql: data } : null));
          }}
        />
      ),
    },
    {
      key: "authorization",
      label: t("authorization"),
      className: "h-full",
      children: (
        <Authorization
          data={editForm?.meta || {}}
          onChange={(data) => {
            setEditForm((prev) => (prev ? { ...prev, meta: data } : null));
          }}
        />
      ),
    },
  ];

  const [searchText, setSearchText] = useState("");
  const [filteredApiList, setFilteredApiList] = useState<ApiDefinition[]>([]);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<any>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 过滤 API 列表数据
  const filterApiList = (
    apis: ApiDefinition[],
    searchText: string
  ): ApiDefinition[] => {
    if (!searchText) return apis;

    return apis
      .map((api) => {
        if (api.name.toLowerCase().includes(searchText.toLowerCase())) {
          return api;
        }
        if (api.children) {
          const filteredChildren = filterApiList(api.children, searchText);
          if (filteredChildren.length > 0) {
            return { ...api, children: filteredChildren };
          }
        }
        return null;
      })
      .filter(Boolean) as ApiDefinition[];
  };

  // 监听搜索输入框变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = filterApiList(apiList, value);
    setFilteredApiList(filteredData);
  };

  // 初始化过滤后的数据
  useEffect(() => {
    setFilteredApiList(apiList);
  }, [apiList]);

  // 紧凑主题样式
  const cardStyle = {
    height: "100%",
    display: "flex",
    flexDirection: "column" as const,
  };

  return (
    <Card
      className={`${styles.apiManagementWrapper} h-full w-full`}
      style={cardStyle}
    >
      <Splitter className="h-full">
        <Splitter.Panel defaultSize="20%" max="40%" collapsible>
          <Card className={`${styles.apiManagementWrapper} h-full`}>
            <Space direction="vertical" size="small" className="w-full">
              <Flex gap="small" align="center">
                <Input
                  placeholder={t("search_apis")}
                  value={searchText}
                  onChange={handleSearchChange}
                  allowClear
                  prefix={<SearchOutlined />}
                  className="flex-1"
                />
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => showCreateApiDialog()}>
                        {t("new_api")}
                      </Menu.Item>
                      <Menu.Item onClick={() => showCreateFolderDialog()}>
                        {t("new_folder")}
                      </Menu.Item>
                      <Menu.Item
                        onClick={() => setBatchCreateDrawerVisible(true)}
                      >
                        {t("batch_new_api")}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button icon={<PlusOutlined />} />
                </Dropdown>
              </Flex>
              <div className="flex-1 overflow-auto">
                <Tree
                  tree={{ children: convertApiListToTreeData(filteredApiList) }}
                  selected={
                    selectedNode ? { path: selectedNode.data.id } : { path: "" }
                  }
                  onClickItem={(item: any) => {
                    setSelectedNode({
                      children: [],
                      data: item.data,
                      isLeaf: item.type === "file",
                      key: item.path,
                      settingVisible: false,
                      title: item.filename,
                    });
                  }}
                  renderMore={(item: any) => {
                    return (
                      <Dropdown
                        overlay={
                          <Menu>
                            {item.type === "folder" && (
                              <>
                                <Menu.Item
                                  onClick={() =>
                                    showCreateApiDialog(item.data.id)
                                  }
                                >
                                  {t("new_api")}
                                </Menu.Item>
                                <Menu.Item
                                  onClick={() =>
                                    showCreateFolderDialog(item.data.id)
                                  }
                                >
                                  {t("new_folder")}
                                </Menu.Item>
                                <Menu.Divider />
                              </>
                            )}
                            <Menu.Item onClick={() => showEditInput(item.data)}>
                              {t("rename")}
                            </Menu.Item>
                            <Menu.Item
                              style={{ color: "red" }}
                              onClick={(e) => {
                                e.domEvent.stopPropagation();
                                showDeleteConfirm(item.data.id, item.data.name);
                              }}
                            >
                              {t("delete")}
                            </Menu.Item>
                          </Menu>
                        }
                        trigger={["hover"]}
                      >
                        <MoreOutlined onClick={(e) => e.stopPropagation()} />
                      </Dropdown>
                    );
                  }}
                  renderIcon={(item: any, nodeType: any) => {
                    if (nodeType === "file") {
                      const method = item.data?.method;
                      if (method === "GET")
                        return <ApiMethodGet key={`get${item.path}`} />;
                      if (method === "POST")
                        return <ApiMethodPost key={`post${item.path}`} />;
                      if (method === "PUT")
                        return <ApiMethodPut key={`put${item.path}`} />;
                      if (method === "DELETE")
                        return <ApiMethodDelete key={`delete${item.path}`} />;
                      if (method === "PATCH")
                        return <ApiMethodPatch key={`patch${item.path}`} />;
                      return <IconFile key={`file${item.path}`} />;
                    }
                    if (item.data && item.data.type === "FOLDER")
                      return <ApiFolder key={`apifolder${item.path}`} />;
                    return <IconFolder key={`folder${item.path}`} />;
                  }}
                />
              </div>
            </Space>
          </Card>
        </Splitter.Panel>
        <Splitter.Panel>
          <Card className={`${styles.apiManagementWrapper} h-full`}>
            {editForm?.type == "API" ? (
              <div className="flex flex-col h-full">
                <Space direction="vertical" size="small" className="mb-2">
                  <Flex gap="small" justify="flex-start" align="center" wrap>
                    <Input
                      addonBefore={
                        <Select
                          value={editForm?.method}
                          onChange={(value) =>
                            setEditForm({ ...editForm, method: value })
                          }
                          options={methodOptions}
                          style={{ minWidth: 80 }}
                        />
                      }
                      prefix={
                        <span>
                          {config?.application["flexmodel.context-path"]}
                        </span>
                      }
                      className="flex-1"
                      value={editForm?.path}
                      onChange={(e) =>
                        setEditForm({ ...editForm, path: e?.target?.value })
                      }
                    />
                    <Button
                      type="primary"
                      onClick={handleSaveApi}
                      icon={<SaveOutlined />}
                    >
                      {t("save")}
                    </Button>
                    <Switch
                      value={editForm?.enabled}
                      onChange={(val) => {
                        if (editForm) {
                          setEditForm({ ...editForm, enabled: val });
                          updateApiStatus(editForm.id, val).then(() => {
                            message.success(val ? t("enabled") : t("closed"));
                            reqApiList();
                          });
                        }
                      }}
                    />
                  </Flex>
                </Space>
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    overflow: "hidden",
                  }}
                >
                  <Tabs
                    className={styles.apiManagementTab}
                    defaultActiveKey="graphql"
                    items={items}
                    onChange={onChange}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      minHeight: 0,
                    }}
                  />
                </div>
              </div>
            ) : (
              <div>
                <Typography.Text>
                  {t("folder_name")}: {editForm?.name}
                </Typography.Text>
              </div>
            )}
          </Card>
        </Splitter.Panel>
      </Splitter>
      {/* 删除确认弹窗 */}
      <Modal
        title={t("delete")}
        open={deleteConfirmVisible}
        onOk={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
        confirmLoading={deleteLoading}
        okText={t("delete")}
        okButtonProps={{ danger: true }}
        cancelText={t("cancel")}
      >
        <span>
          {t("delete_dialog_text", { name: deleteTarget?.name || "" })}
        </span>
      </Modal>
      {/* 新增重命名弹窗 */}
      <Modal
        title={t("rename")}
        open={renameDialogVisible}
        onCancel={() => setRenameDialogVisible(false)}
        onOk={async () => {
          await renameApi(renameValue);
          setRenameDialogVisible(false);
        }}
      >
        <Input
          value={renameValue}
          onChange={(e) => setRenameValue(e.target.value)}
        />
      </Modal>
      {/* 新建接口弹窗 */}
      <Modal
        title={t("new_api")}
        open={createApiDialogVisible}
        onCancel={() => {
          setCreateApiDialogVisible(false);
          setCreateApiError("");
        }}
        onOk={handleCreateApiForm}
        confirmLoading={createApiLoading}
      >
        <Form
          form={createApiForm}
          layout="vertical"
          onFinish={handleCreateApiForm}
          autoComplete="off"
        >
          <Form.Item label="上级目录">
            <Input
              value={getParentFolderName(createApiParentId)}
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Form.Item>
          <Form.Item
            label={t("name")}
            name="name"
            rules={[{ required: true, message: "名称不能为空" }]}
          >
            <Input placeholder="请输入接口名称" autoFocus />
          </Form.Item>
          <Form.Item
            label={t("method")}
            name="method"
            initialValue="GET"
            rules={[{ required: true, message: "请选择请求方法" }]}
          >
            <Select options={methodOptions} style={{ width: 120 }} />
          </Form.Item>
          <Form.Item
            label={t("path")}
            name="path"
            rules={[{ required: true, message: "接口地址不能为空" }]}
          >
            <Input placeholder="请输入接口地址" />
          </Form.Item>
          {createApiError && (
            <div style={{ color: "red", marginTop: 8 }}>{createApiError}</div>
          )}
        </Form>
      </Modal>
      {/* 新建文件夹弹窗 */}
      <Modal
        title={t("new_folder")}
        open={createFolderDialogVisible}
        onCancel={() => setCreateFolderDialogVisible(false)}
        onOk={handleCreateFolder}
        confirmLoading={createFolderLoading}
      >
        <Form layout="vertical">
          <Form.Item label="上级目录">
            <Input
              value={getParentFolderName(createFolderParentId)}
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Form.Item>
          <Form.Item label={t("folder_name")}>
            <Input
              placeholder={t("folder_name")}
              value={createFolderName}
              onChange={(e) => setCreateFolderName(e.target.value)}
              maxLength={32}
            />
          </Form.Item>
        </Form>
        {createFolderError && (
          <div style={{ color: "red", marginTop: 8 }}>{createFolderError}</div>
        )}
      </Modal>
      <BatchCreate
        onConfirm={(data: any) => {
          console.log(data);
          reqApiList();
          setBatchCreateDrawerVisible(false);
        }}
        onCancel={() => setBatchCreateDrawerVisible(false)}
        visible={batchCreateDialogDrawer}
      />
    </Card>
  );
};

export default ApiManagement;
