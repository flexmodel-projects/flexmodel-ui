import React, {useEffect, useState} from "react";
import {
  Button,
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
import PageContainer from "@/components/common/PageContainer";
import {MoreOutlined, PlusOutlined, SaveOutlined, SearchOutlined,} from "@ant-design/icons";
import {createApi, deleteApi, getApis, updateApi, updateApiName, updateApiStatus,} from "@/services/api-info.ts";
import APIDetail from "./components/APIDetail";
import Authorization from "./components/Authorization";
import {useTranslation} from "react-i18next";
import {ApiDefinition, GraphQLData, TreeNode} from "@/types/api-management";
import BatchCreate from "./components/BatchCreate";
import {useConfig} from "@/store/appStore.ts";
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
import ExecuteConfig from "./components/ExecuteConfig";

const UserDefineAPI: React.FC = () => {
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

  const [createParentId, setCreateParentId] = useState<string | null>(null);
  // 新建接口弹窗逻辑
  const [createApiDialogVisible, setCreateApiDialogVisible] = useState(false);
  // 新建文件夹弹窗逻辑
  const [createFolderDialogVisible, setCreateFolderDialogVisible] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createApiPath, setCreateApiPath] = useState("/");
  const [createApiMethod, setCreateApiMethod] = useState("GET");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];



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
    setCreateParentId(parentId || null);
    setCreateName("");
    setCreateApiPath("/");
    setCreateApiMethod("GET");
    setCreateError("");
    setCreateApiDialogVisible(true);
  };

  const addFolder = async (parentId?: string | null) => {
    if (!createName.trim()) {
      setCreateError(t("folder_name_required"));
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      await createApi({
        name: createName,
        parentId: parentId,
        type: "FOLDER",
      });
      message.success(t("create_success"));
      setCreateFolderDialogVisible(false);
      setCreateName("");
      setCreateApiPath("/");
      setCreateApiMethod("GET");
      reqApiList();
    } catch (error: any) {
      setCreateError(error.message || t("create_failed"));
    } finally {
      setCreateLoading(false);
    }
  };

  const addApi = async (parentId?: string | null) => {
    if (!createName.trim()) {
      setCreateError(t("api_name_required"));
      return;
    }
    if (!createApiPath.trim()) {
      setCreateError(t("api_path_required"));
      return;
    }
    setCreateLoading(true);
    setCreateError("");
    try {
      const normalizedPath = createApiPath.trim().startsWith("/")
        ? createApiPath.trim()
        : `/${createApiPath.trim()}`;
      await createApi({
        name: createName.trim(),
        parentId: parentId,
        type: "API",
        method: createApiMethod,
        path: normalizedPath,
        enabled: false,
        meta: {},
      });
      message.success(t("create_success"));
      setCreateApiDialogVisible(false);
      setCreateName("");
      setCreateApiPath("/");
      setCreateApiMethod("GET");
      reqApiList();
    } catch (error: any) {
      setCreateError(error.message || t("create_failed"));
    } finally {
      setCreateLoading(false);
    }
  };

  const showCreateFolderDialog = (parentId?: string | null) => {
    setCreateParentId(parentId || null);
    setCreateFolderDialogVisible(true);
    setCreateName("");
    setCreateApiPath("/");
    setCreateApiMethod("GET");
    setCreateError("");
  };

  const handleCreateFolder = async () => {
    await addFolder(createParentId);
  };

  const handleCreateApi = async () => {
    await addApi(createParentId);
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
    if (!parentId) return t("root_directory");

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
    return parent ? parent.name : t("unknown_directory");
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
      key: "detail",
      label: t("api_detail.title"),
      className: "h-full",
      children: (
        <APIDetail data={editForm || undefined}
        />
      ),
    },
    {
      key: "execute_config",
      label: t("apis.execute_config"),
      className: "h-full",
      children: (
        <ExecuteConfig
          data={editForm?.meta || {}}
          onChange={(data) => {
            setEditForm((prev) => (prev ? { ...prev, meta: data } : null));
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

  return (
    <PageContainer>
      <Splitter>
        <Splitter.Panel defaultSize="20%" max="40%" collapsible>
          <div className="pr-2">
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
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          {editForm?.type == "API" ? (
            <div className="flex flex-col h-full pl-2">
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
                        {config?.apiRootPath}
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
                  defaultActiveKey="detail"
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
        onCancel={() => setCreateApiDialogVisible(false)}
        onOk={handleCreateApi}
        confirmLoading={createLoading}
      >
        <Form layout="vertical">
          <Form.Item label={t("apis.parent_folder")}>
            <Input
              value={getParentFolderName(createParentId)}
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Form.Item>
          <Form.Item label={t("apis.name")}>
            <Input
              placeholder={t("apis.name")}
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              maxLength={32}
            />
          </Form.Item>
          <Form.Item label={t("apis.method")}>
            <Select
              value={createApiMethod}
              options={methodOptions}
              onChange={(value) => setCreateApiMethod(value)}
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item label={t("apis.api_path")}>
            <Input
              placeholder={t("apis.api_path")}
              value={createApiPath}
              onChange={(e) => setCreateApiPath(e.target.value)}
            />
          </Form.Item>
        </Form>
        {createError && (
          <div style={{ color: "red", marginTop: 8 }}>{createError}</div>
        )}
      </Modal>
      {/* 新建文件夹弹窗 */}
      <Modal
        title={t("new_folder")}
        open={createFolderDialogVisible}
        onCancel={() => setCreateFolderDialogVisible(false)}
        onOk={handleCreateFolder}
        confirmLoading={createLoading}
      >
        <Form layout="vertical">
          <Form.Item label={t("apis.parent_folder")}>
            <Input
              value={getParentFolderName(createParentId)}
              disabled
              style={{ backgroundColor: "#f5f5f5" }}
            />
          </Form.Item>
          <Form.Item label={t("folder_name")}>
            <Input
              placeholder={t("folder_name")}
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              maxLength={32}
            />
          </Form.Item>
        </Form>
        {createError && (
          <div style={{ color: "red", marginTop: 8 }}>{createError}</div>
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
    </PageContainer>
  );
};

export default UserDefineAPI;
