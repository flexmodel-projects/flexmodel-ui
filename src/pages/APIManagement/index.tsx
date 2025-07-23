import React, {useEffect, useRef, useState} from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Flex,
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
  Tooltip,
  Tree,
} from "antd";
import {MoreOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {createApi, deleteApi, getApis, updateApi, updateApiName, updateApiStatus,} from "../../services/api-info.ts";
import "./index.css";
import GraphQL from "./components/GraphQL.tsx";
import HoverEditInput from "./components/HoverEditInput.tsx";
import Authorization from "./components/Authorization.tsx";
import {useTranslation} from "react-i18next";
import {ApiInfo, TreeNode} from "./data";
import BatchCreate from "./components/BatchCreate.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../../store/configStore.ts";

const { DirectoryTree } = Tree;

const ApiManagement: React.FC = () => {
  const { t } = useTranslation();
  const { config } = useSelector((state: RootState) => state.config);

  // 状态定义
  const [apiList, setApiList] = useState<ApiInfo[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const [batchCreateDialogDrawer, setBatchCreateDrawerVisible] =
    useState<boolean>(false);

  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editNode, setEditNode] = useState<string>("");
  const [editForm, setEditForm] = useState<any>({});
  const treeRef = useRef<any>(null); // 使用 `any` 类型避免过于严格的类型检查
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

  const methodOptions = [
    { value: "GET", label: "GET" },
    { value: "POST", label: "POST" },
    { value: "PUT", label: "PUT" },
    { value: "PATCH", label: "PATCH" },
    { value: "DELETE", label: "DELETE" },
  ];

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

  // 删除处理
  const handleDelete = async () => {
    setDeleteDialogVisible(false);
    if (selectedNode) {
      await deleteApi(selectedNode.data.id);
      await reqApiList();
    }
  };

  // 显示编辑输入框
  const showEditInput = (data: ApiInfo) => {
    setEditForm(data);
    setEditNode(data.id);
  };

  // 编辑 API
  const renameApi = async (name: string) => {
    setEditNode("");
    if (editForm.id) {
      await updateApiName(editForm.id, name);
      await reqApiList();
    }
  };

  const addApi = async (parentId?: string | null) => {
    const reqData = {
      parentId: parentId,
      name: t("new_api"),
      type: "API",
      method: "GET",
      meta: { auth: false },
    };
    const newApi = await createApi(reqData);
    await reqApiList();
    setExpandedKeys([parentId]);
    setSelectedKeys([newApi.id]);
    showEditInput(newApi);
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

  // 渲染树节点
  const renderTreeNodes = (data: ApiInfo[]): any[] =>
    data.map((item) => ({
      title: (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              overflow: "hidden",
              paddingLeft: "4px",
            }}
          >
            <Tooltip title={item.name}>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {editNode === item.id ? (
                  <HoverEditInput
                    onChange={renameApi}
                    value={editForm.name || ""}
                  />
                ) : (
                  item.name
                )}
              </span>
            </Tooltip>

            <Dropdown
              overlay={
                <Menu>
                  {item.type == "FOLDER" && (
                    <Menu.Item onClick={() => addApi(item?.id)}>
                      {t("new_api")}
                    </Menu.Item>
                  )}
                  <Menu.Item onClick={() => showEditInput(item)}>
                    {t("rename")}
                  </Menu.Item>
                  <Menu.Item
                    style={{ color: "red" }}
                    onClick={() => {
                      setDeleteDialogVisible(true);
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
          </div>
        </>
      ),
      key: item.id,
      isLeaf: item.type === "API",
      children: item.children ? renderTreeNodes(item.children) : [],
      data: item,
    }));

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
    <Card className="h-full api-management-wrapper">
      <Row className="h-full">
        <Splitter>
          <Splitter.Panel
            defaultSize="20%"
            max="40%"
            collapsible
            className="flex w-1/5 flex-col"
          >
            <Space align="center">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item onClick={() => addApi()}>
                      {t("new_api")}
                    </Menu.Item>
                    <Menu.Item onClick={() => addFolder()}>
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
              <Input
                placeholder={t("search_apis")}
                value={searchText} // 绑定搜索框的值
                onChange={handleSearchChange} // 监听输入框变化
                allowClear
              />
            </Space>
            <DirectoryTree
              className="api-tree"
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              ref={treeRef}
              treeData={renderTreeNodes(filteredApiList)} // 使用过滤后的数据
              onSelect={(selectedKeys, { node }) => {
                setSelectedKeys(selectedKeys);
                handleNodeClick(node);
              }}
              height={538}
            />
          </Splitter.Panel>
          <Splitter.Panel className="flex">
            <Card className="api-management-card flex-1 w-full">
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
                        style={{ width: "85%" }}
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
        <Modal
          open={deleteDialogVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteDialogVisible(false)}
          title={`${t("delete")} '${selectedNode?.data?.name}?'`}
        >
          <span>
            {t("delete_dialog_text", { name: selectedNode?.data?.name || "" })}
          </span>
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
    </Card>
  );
};

export default ApiManagement;
