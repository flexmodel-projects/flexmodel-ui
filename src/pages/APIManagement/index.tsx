import React, {useEffect, useRef, useState} from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
  Splitter,
  Switch,
  Tabs,
  TabsProps,
  theme as antdTheme,
} from "antd";
import {MoreOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {createApi, deleteApi, getApis, updateApi, updateApiName, updateApiStatus,} from "../../services/api-info.ts";
import "./index.css";
import GraphQL from "./components/GraphQL.tsx";
import Authorization from "./components/Authorization.tsx";
import {useTranslation} from "react-i18next";
import {ApiInfo, TreeNode} from "@/types/api-management";
import BatchCreate from "./components/BatchCreate.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";
// @ts-expect-error: no type definition for Tree.jsx
import Tree from '@/components/explore/explore/Tree.jsx';
// @ts-expect-error: no type definition for Icons.jsx
import {
  ApiFolder,
  ApiMethodDelete,
  ApiMethodGet,
  ApiMethodPatch,
  ApiMethodPost,
  ApiMethodPut,
  IconFile,
  IconFolder
} from '@/components/explore/icons/Icons.jsx';


const ApiManagement: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSelector((state: RootState) => state.config);
  const { token } = antdTheme.useToken();

  // 状态定义
  const [apiList, setApiList] = useState<ApiInfo[]>([]);
  const [batchCreateDialogDrawer, setBatchCreateDrawerVisible] =
    useState<boolean>(false);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const treeRef = useRef<any>(null); // 使用 `any` 类型避免过于严格的类型检查
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [renameDialogVisible, setRenameDialogVisible] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [renameTarget, setRenameTarget] = useState<any>(null);

  // 新建接口弹窗逻辑
  const [createApiMethod, setCreateApiMethod] = useState("GET");
  const [createApiPath, setCreateApiPath] = useState("");
  const [createApiDialogVisible, setCreateApiDialogVisible] = useState(false);
  const [createApiName, setCreateApiName] = useState("");
  const [createApiParentId, setCreateApiParentId] = useState<string | null>(null);
  const [createApiLoading, setCreateApiLoading] = useState(false);
  const [createApiError, setCreateApiError] = useState("");

  // 新建文件夹弹窗逻辑
  const [createFolderDialogVisible, setCreateFolderDialogVisible] = useState(false);
  const [createFolderName, setCreateFolderName] = useState("");
  const [createFolderParentId, setCreateFolderParentId] = useState<string | null>(null);
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
    setEditForm(selectedNode?.data);
  }, [selectedNode]);

  useEffect(() => {}, [editForm]);

  // 请求 API 列表数据
  useEffect(() => {
    reqApiList().then((apis) => {
      const getDefaultSelectedApi = (apis: any) => {
        for (const api of apis) {
          if (api.type === "API") {
            return api;
          }
          if (api.children) {
            const child: any = getDefaultSelectedApi(api?.children);
            if (child) {
              return child;
            }
          }
        }
        return null;
      };

      const defaultSelectedApi = getDefaultSelectedApi(apis);
      setExpandedKeys([defaultSelectedApi.parentId]); // 展开第一项
      setSelectedKeys([defaultSelectedApi.id]);
      setSelectedNode({
        children: [],
        data: defaultSelectedApi,
        isLeaf: false,
        key: defaultSelectedApi.id,
        settingVisible: false,
        title: defaultSelectedApi.name,
      });
    });
  }, []);

  // 渲染树节点
  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
  };

  // 请求 API 列表数据
  const reqApiList = async () => {
    const apis = await getApis();
    setApiList(apis);
    setFilteredApiList(apis); // 初始时展示完整数据
    return apis;
  };

  // 节点点击处理
  const handleNodeClick = (nodeData: TreeNode) => {
    setSelectedNode(nodeData);
  };

  // 删除确认弹窗逻辑
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const showDeleteConfirm = (id: string, name: string) => {
    setDeleteTarget({ id, name });
    setDeleteConfirmVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;
    setDeleteLoading(true);
    try {
      await deleteApi(deleteTarget.id);
      await reqApiList();
      setDeleteConfirmVisible(false);
      setDeleteTarget(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  // 替换showEditInput
  const showEditInput = (data: ApiInfo) => {
    setRenameTarget(data);
    setRenameValue(data.name);
    setRenameDialogVisible(true);
  };

  // 编辑 API
  const renameApi = async (name: string) => {
    setEditNode("");
    if (renameTarget.id) {
      await updateApiName(renameTarget.id, name);
      await reqApiList();
    }
  };

  // 新建接口弹窗触发
  const showCreateApiDialog = (parentId?: string | null) => {
    setCreateApiParentId(parentId || null);
    setCreateApiDialogVisible(true);
    setCreateApiError("");
    setTimeout(() => {
      createApiForm.resetFields();
      createApiForm.setFieldsValue({ method: "GET" });
    }, 0);
  };

  // 表单提交
  const handleCreateApiForm = async () => {
    try {
      const values = await createApiForm.validateFields();
      await addApi(createApiParentId, values.name, values.method, values.path);
    } catch (e) {
      // 校验失败不处理
    }
  };

  // 修改addApi逻辑，支持传入名称、method、path
  const addApi = async (parentId?: string | null, name?: string, method?: string, path?: string) => {
    if (!name || !name.trim()) {
      setCreateApiError('名称不能为空');
      return;
    }
    if (!path || !path.trim()) {
      setCreateApiError('接口地址不能为空');
      return;
    }
    setCreateApiLoading(true);
    try {
      const reqData = {
        parentId: parentId,
        name: name,
        type: "API",
        method: method || "GET",
        path: path,
        meta: { auth: false },
        enabled: true,
      };
      const newApi = await createApi(reqData);
      await reqApiList();
      setExpandedKeys([parentId]);
      setSelectedKeys([newApi.id]);
      setCreateApiDialogVisible(false);
      setCreateApiName("");
      setCreateApiPath("");
      setCreateApiError("");
    } catch (e) {
      setCreateApiError('提交失败，请重试');
    } finally {
      setCreateApiLoading(false);
    }
  };

  const addFolder = async (parentId?: string | null) => {
    const reqData = {
      parentId: parentId,
      name: t("new_folder"),
      type: "FOLDER",
    };
    const newApi = await createApi(reqData);
    await reqApiList();
    showEditInput(newApi);
  };

  const showCreateFolderDialog = (parentId?: string | null) => {
    setCreateFolderParentId(parentId || null);
    setCreateFolderName("");
    setCreateFolderDialogVisible(true);
    setCreateFolderError("");
  };

  const handleCreateFolder = async () => {
    if (!createFolderName.trim()) {
      setCreateFolderError("名称不能为空");
      return;
    }
    setCreateFolderLoading(true);
    try {
      const reqData = {
        parentId: createFolderParentId,
        name: createFolderName,
        type: "FOLDER",
      };
      await createApi(reqData);
      await reqApiList();
      setCreateFolderDialogVisible(false);
      setCreateFolderName("");
      setCreateFolderError("");
    } catch (e) {
      setCreateFolderError("提交失败，请重试");
    } finally {
      setCreateFolderLoading(false);
    }
  };

  // 转换apiList为Tree.jsx需要的数据结构
  function convertApiListToTreeData(list) {
    return list.map(item => {
      if (item.type === 'FOLDER') {
        return {
          type: 'folder',
          filename: item.name,
          path: item.id,
          children: item.children ? convertApiListToTreeData(item.children) : [],
          data: item,
        };
      } else {
        return {
          type: 'file',
          filename: item.name,
          path: item.id,
          data: item,
        };
      }
    });
  }

  const handleSaveApi = async () => {
    await updateApi(editForm.id, editForm);
    message.success(t("saved"));
    await reqApiList();
  };

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "graphql",
      label: "GraphQL",
      children: (
        <GraphQL
          onChange={(value) =>
            setEditForm({
              ...editForm,
              meta: { ...editForm?.meta, execution: value },
            })
          }
          data={selectedNode?.data?.meta?.execution}
        />
      ),
    },
    {
      key: "authorization",
      label: t("config"),
      children: (
        <Authorization
          data={selectedNode?.data.meta}
          onChange={(data) => {
            console.debug("auth onchange", data);
            setEditForm({ ...editForm, meta: { ...editForm.meta, ...data } });
          }}
        />
      ),
    },
  ];

  const [searchText, setSearchText] = useState<string>(""); // 搜索文本状态
  const [filteredApiList, setFilteredApiList] = useState<ApiInfo[]>([]); // 新增的状态，用于保存过滤后的数据
  // 搜索 API 列表数据
  const filterApiList = (apis: ApiInfo[], searchText: string): ApiInfo[] => {
    if (!searchText) return apis; // 如果没有输入搜索词，返回原始数据

    return apis
      .map((api) => {
        // 递归遍历子节点
        const children = api.children
          ? filterApiList(api.children, searchText)
          : [];
        if (
          api.name.toLowerCase().includes(searchText.toLowerCase()) ||
          children.length > 0
        ) {
          return { ...api, children };
        }
        return null;
      })
      .filter(Boolean) as ApiInfo[];
  };

  // 监听搜索输入框变化
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    const filteredData = filterApiList(apiList, value);
    setFilteredApiList(filteredData); // 更新过滤后的数据
  };

  return (
    <div
      className="api-management-wrapper min-h-screen bg-white text-black dark:bg-[#18181c] dark:text-[#f5f5f5]"
      // style属性保留token变量，兼容Antd主题
      style={{
        background: token.colorBgContainer,
        color: token.colorText,
        minHeight: '100vh',
        padding: 16,
      }}
    >
      <div className="h-full flex flex-col">
        <Row gutter={0} className="h-full">
          <Splitter className="h-full">
            <Splitter.Panel size="25%" collapsible className="bg-white dark:bg-[#23232a] pr-4">
              <Space align="center">
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={() => showCreateApiDialog()}>
                        {t("new_api")}
                      </Menu.Item>
                      <Menu.Item onClick={() => showCreateFolderDialog()}>
                        {t("new_folder")}
                      </Menu.Item>
                      <Menu.Item onClick={() => setBatchCreateDrawerVisible(true)}>
                        {t("batch_new_api")}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <Button icon={<PlusOutlined />} />
                </Dropdown>
                <Input
                  placeholder={t("search_apis")}
                  value={searchText}
                  onChange={handleSearchChange}
                  allowClear
                />
              </Space>
              <Tree
                tree={{ children: convertApiListToTreeData(apiList) }}
                selected={selectedNode ? { path: selectedNode.data.id } : { path: '' }}
                onClickItem={item => {
                  setSelectedNode({
                    children: [],
                    data: item.data,
                    isLeaf: item.type === 'file',
                    key: item.path,
                    settingVisible: false,
                    title: item.filename,
                  });
                  setSelectedKeys([item.path]);
                }}
                renderMore={item => {
                  // 仅文件和文件夹都显示更多按钮
                  return (
                    <Dropdown
                      overlay={
                        <Menu>
                          {item.type === 'folder' && (
                            <Menu.Item onClick={() => showCreateApiDialog(item.data.id)}>
                              {t('new_api')}
                            </Menu.Item>
                          )}
                          <Menu.Item onClick={() => showEditInput(item.data)}>
                            {t('rename')}
                          </Menu.Item>
                          <Menu.Item style={{ color: 'red' }} onClick={e => { e.domEvent.stopPropagation(); showDeleteConfirm(item.data.id, item.data.name); }}>
                            {t('delete')}
                          </Menu.Item>
                        </Menu>
                      }
                      trigger={["hover"]}
                    >
                      <MoreOutlined onClick={e => e.stopPropagation()} />
                    </Dropdown>
                  );
                }}
                renderIcon={(item, nodeType) => {
                  if (nodeType === 'file') {
                    const method = item.data?.method;
                    if (method === 'GET') return <ApiMethodGet key={`get${item.path}`} />;
                    if (method === 'POST') return <ApiMethodPost key={`post${item.path}`} />;
                    if (method === 'PUT') return <ApiMethodPut key={`put${item.path}`} />;
                    if (method === 'DELETE') return <ApiMethodDelete key={`delete${item.path}`} />;
                    if (method === 'PATCH') return <ApiMethodPatch key={`patch${item.path}`} />;
                    return <IconFile key={`file${item.path}`} />;
                  }
                  // API分组文件夹特殊icon
                  if (item.data && item.data.type === 'FOLDER') return <ApiFolder key={`apifolder${item.path}`} />;
                  return <IconFolder key={`folder${item.path}`} />;
                }}
              />
            </Splitter.Panel>
            <Splitter.Panel className="flex pl-4">
              <Card className="api-management-card flex-1 w-full bg-white dark:bg-[#23232a] text-black dark:text-[#f5f5f5]"
                style={{ background: token.colorBgContainer, color: token.colorText }}>
                {editForm?.type == "API" ? (
                  <Row className="flex flex-col">
                    <Col className="pb-[10px] h-[42px]">
                      <Flex gap="small" justify="flex-start" align="center" wrap>
                        <Input
                          addonBefore={
                            <Select
                              value={editForm?.method}
                              onChange={(value) =>
                                setEditForm({ ...editForm, method: value })
                              }
                              options={methodOptions}
                            />
                          }
                          prefix={<span>{config?.application['flexmodel.context-path']}</span>}
                          className="w-[85%]"
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
                            setEditForm({ ...editForm, enabled: val });
                            updateApiStatus(editForm.id, val).then(() => {
                              message.success(val ? t("enabled") : t("closed"));
                              reqApiList();
                            });
                          }}
                        />
                      </Flex>
                    </Col>
                    <Col className="flex-1">
                      <Tabs
                        size="small"
                        defaultActiveKey="graphql"
                        items={items}
                        onChange={onChange}
                      />
                    </Col>
                  </Row>
                ) : (
                  <div>
                    <div>
                      {t("folder_name")}: {editForm?.name}
                    </div>
                  </div>
                )}
              </Card>
            </Splitter.Panel>
          </Splitter>
          {/* 删除确认弹窗 */}
          <Modal
            title={t('delete')}
            open={deleteConfirmVisible}
            onOk={handleDelete}
            onCancel={() => setDeleteConfirmVisible(false)}
            confirmLoading={deleteLoading}
            okText={t('delete')}
            okButtonProps={{ danger: true }}
            cancelText={t('cancel')}
          >
            <span>{t('delete_dialog_text', { name: deleteTarget?.name || '' })}</span>
          </Modal>
          {/* 新增重命名弹窗 */}
          <Modal
            title={t('rename')}
            open={renameDialogVisible}
            onCancel={() => setRenameDialogVisible(false)}
            onOk={async () => {
              await renameApi(renameValue);
              setRenameDialogVisible(false);
            }}
          >
            <Input value={renameValue} onChange={e => setRenameValue(e.target.value)} />
          </Modal>
          {/* 新建接口弹窗 */}
          <Modal
            title={t('new_api')}
            open={createApiDialogVisible}
            onCancel={() => { setCreateApiDialogVisible(false); setCreateApiError(""); }}
            onOk={handleCreateApiForm}
            confirmLoading={createApiLoading}
          >
            <Form
              form={createApiForm}
              layout="vertical"
              onFinish={handleCreateApiForm}
              autoComplete="off"
            >
              <Form.Item
                label={t('name')}
                name="name"
                rules={[{ required: true, message: '名称不能为空' }]}
              >
                <Input placeholder="请输入接口名称" autoFocus />
              </Form.Item>
              <Form.Item
                label={t('method')}
                name="method"
                initialValue="GET"
                rules={[{ required: true, message: '请选择请求方法' }]}
              >
                <Select options={methodOptions} style={{ width: 120 }} />
              </Form.Item>
              <Form.Item
                label={t('path')}
                name="path"
                rules={[{ required: true, message: '接口地址不能为空' }]}
              >
                <Input placeholder="请输入接口地址" />
              </Form.Item>
              {createApiError && <div style={{ color: 'red', marginTop: 8 }}>{createApiError}</div>}
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
            <Input
              placeholder={t("folder_name")}
              value={createFolderName}
              onChange={e => setCreateFolderName(e.target.value)}
              maxLength={32}
            />
            {createFolderError && <div style={{ color: 'red', marginTop: 8 }}>{createFolderError}</div>}
          </Modal>
        </Row>
        <BatchCreate
          onConfirm={(data: any) => {
            console.log(data);
            reqApiList();
            setBatchCreateDrawerVisible(false);
          }}
          onCancel={() => setBatchCreateDrawerVisible(false)}
          visible={batchCreateDialogDrawer}
        />
      </div>
    </div>
  );
};

export default ApiManagement;
