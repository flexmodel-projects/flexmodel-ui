import React, {useEffect, useRef, useState} from "react";
import {
  Breadcrumb,
  Button,
  Card,
  Col,
  Drawer,
  Dropdown,
  Flex,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Tabs,
  TabsProps,
  Tree,
} from "antd";
import {EyeInvisibleOutlined, EyeOutlined, MoreOutlined, PlusOutlined, SaveOutlined} from "@ant-design/icons";
import {createApi, deleteApi, getApis, updateApi, updateApiName, updateApiStatus} from "../../api/api-info.ts";
import "./index.css";
import GraphQL from "./components/GraphQL.tsx";
import HoverEditInput from "./components/HoverEditInput.tsx";
import Authorization from "./components/Authorization.tsx";

const {DirectoryTree} = Tree;

// 定义 Tree 数据类型
interface ApiInfo {
  id: string;
  name: string;
  type?: string;
  method?: string;
  children?: ApiInfo[];
  settingVisible?: boolean;
  data: any;
  meta: any;
  enabled: boolean;
}

interface TreeNode {
  title: string;
  key: string;
  isLeaf?: boolean;
  children?: TreeNode[];
  settingVisible?: boolean;
  data: ApiInfo;
}

const ApiManagement: React.FC = () => {
  // 状态定义
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [apiList, setApiList] = useState<ApiInfo[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [apiDialogVisible, setApiDialogVisible] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editNode, setEditNode] = useState<string>("")
  const [editForm, setEditForm] = useState<any>({})
  const treeRef = useRef<any>(null) // 使用 `any` 类型避免过于严格的类型检查
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);

  // 添加树的显示/隐藏状态
  const [isTreeVisible, setIsTreeVisible] = useState<boolean>(true);

  useEffect(() => {
    setEditForm(selectedNode?.data)
  }, [selectedNode])

  useEffect(() => {
  }, [editForm])

  // 请求 API 列表数据
  useEffect(() => {
    reqApiList().then(apis => {
      const getDefaultSelectedApi = (apis: any) => {
        for (const api of apis) {
          if (api.type === 'API') {
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
      }

      const defaultSelectedApi = getDefaultSelectedApi(apis);
      setExpandedKeys([defaultSelectedApi.parentId]); // 展开第一项
      setSelectedKeys([defaultSelectedApi.id]);
      setSelectedNode({
        children: [],
        data: defaultSelectedApi,
        isLeaf: false,
        key: defaultSelectedApi.id,
        settingVisible: false,
        title: defaultSelectedApi.name
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
    setDeleteDialogVisible(false)
    if (selectedNode) {
      await deleteApi(selectedNode.data.id)
      await reqApiList()
    }
  };

  // 显示编辑输入框
  const showEditInput = (data: ApiInfo) => {
    setEditForm(data)
    setEditNode(data.id)
  };

  // 编辑 API
  const renameApi = async (name: string) => {
    setEditNode('')
    if (editForm.id) {
      await updateApiName(editForm.id, name)
      await reqApiList()
    }
  };

  const addApi = async (parentId?: string | null) => {
    const reqData = {parentId: parentId, name: 'New API', type: 'API', method: 'GET', meta: {auth: false}};
    const newApi = await createApi(reqData);
    await reqApiList();
    setExpandedKeys([parentId]);
    setSelectedKeys([newApi.id]);
    showEditInput(newApi);
  }

  const addFolder = async (parentId?: string | null) => {
    const reqData = {parentId: parentId, name: 'New Folder', type: 'FOLDER'};
    const newApi = await createApi(reqData);
    await reqApiList();
    showEditInput(newApi);
  }

  const methodOptions = [
    {value: 'GET', label: 'GET'},
    {value: 'POST', label: 'POST'},
    {value: 'PUT', label: 'PUT'},
    {value: 'PATCH', label: 'PATCH'},
    {value: 'DELETE', label: 'DELETE'},
  ];

  // 渲染树节点
  const renderTreeNodes = (data: ApiInfo[]): any[] =>
    data.map((item) => ({
      title: (
        <>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {editNode === item.id ? (
              <HoverEditInput onChange={renameApi} value={editForm.name || ''}/>
            ) : (
              item.name
            )}
            <Dropdown
              overlay={
                <Menu>
                  {item.type == 'FOLDER' && <Menu.Item onClick={() => addApi(item?.id)}>New API</Menu.Item>}
                  <Menu.Item onClick={() => showEditInput(item)}>Rename</Menu.Item>
                  <Menu.Item onClick={() => {
                    setDeleteDialogVisible(true)
                  }}>Delete</Menu.Item>
                </Menu>
              }
              trigger={['hover']}
            >
              <MoreOutlined className={item.settingVisible ? "" : "invisible"} onClick={(e) => e.stopPropagation()}/>
            </Dropdown>
          </div>

        </>
      ),
      key: item.id,
      isLeaf: item.type === 'API',
      children: item.children ? renderTreeNodes(item.children) : [],
      data: item
    }))

  const handleSaveApi = async () => {
    await updateApi(editForm.id, editForm)
    message.success('Saved')
    await reqApiList()
  }

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps['items'] = [
    {
      key: 'graphql',
      label: 'GraphQL',
      children: <GraphQL onChange={value => setEditForm({...editForm, meta: {...editForm?.meta, execution: value}})}
                         data={selectedNode?.data?.meta?.execution}/>,
    },
    {
      key: 'authorization',
      label: 'Authorization',
      children: <Authorization data={selectedNode?.data.meta} onChange={data => {
        console.debug('auth onchange', data);
        setEditForm({...editForm, meta: {...editForm.meta, ...data}});
      }}/>,
    }
  ];

  const [searchText, setSearchText] = useState<string>(""); // 搜索文本状态
  const [filteredApiList, setFilteredApiList] = useState<ApiInfo[]>([]); // 新增的状态，用于保存过滤后的数据
  // 搜索 API 列表数据
  const filterApiList = (apis: ApiInfo[], searchText: string): ApiInfo[] => {
    if (!searchText) return apis; // 如果没有输入搜索词，返回原始数据

    return apis
      .map((api) => {
        // 递归遍历子节点
        const children = api.children ? filterApiList(api.children, searchText) : [];
        if (api.name.toLowerCase().includes(searchText.toLowerCase()) || children.length > 0) {
          return {...api, children};
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
    <>
      <Row>
        {isTreeVisible && <Col span={5}>
          <Card>
            <Space align="baseline">
              <Dropdown overlay={
                <Menu>
                  <Menu.Item onClick={() => addApi()}>New API</Menu.Item>
                  <Menu.Item onClick={() => addFolder()}>New Folder</Menu.Item>
                </Menu>
              }>
                <Button icon={<PlusOutlined/>}/>
              </Dropdown>
              <Input
                style={{marginBottom: 8}}
                placeholder="Search APIs"
                value={searchText} // 绑定搜索框的值
                onChange={handleSearchChange} // 监听输入框变化
                allowClear
              />
            </Space>
            <DirectoryTree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              ref={treeRef}
              treeData={renderTreeNodes(filteredApiList)} // 使用过滤后的数据
              onSelect={(selectedKeys, {node}) => {
                setSelectedKeys(selectedKeys);
                handleNodeClick(node);
              }}
              height={538}
            />
          </Card>
        </Col>}
        <Col span={isTreeVisible ? 19 : 24} style={{paddingLeft: isTreeVisible ? '10px' : '0px'}}>
          <Row>
            <Col style={{paddingBottom: '10px'}} span={24}>
              <Space>
                <Button
                  icon={isTreeVisible ? <EyeOutlined/> : <EyeInvisibleOutlined/>}
                  onClick={() => setIsTreeVisible(!isTreeVisible)}
                >
                  {isTreeVisible ? 'Hide APIs' : 'Show APIs'}
                </Button>
                <span>
                {editForm?.name}
                </span>
              </Space>
            </Col>
            <Col style={{paddingBottom: '10px'}} span={24}>
              <Flex gap="small" justify="flex-start" wrap>
                <Input addonBefore={
                  <Select value={editForm?.method}
                          onChange={value => setEditForm({...editForm, method: value})}
                          options={methodOptions}/>
                }
                       prefix={<span>/api/v1</span>}
                       style={{width: '85%'}} value={editForm?.path}
                       onChange={e => setEditForm({...editForm, path: e?.target?.value})}/>

                <Button type="primary" onClick={handleSaveApi} icon={<SaveOutlined/>}>
                  Save
                </Button>
                <Switch value={editForm?.enabled} onChange={val => {
                  setEditForm({...editForm, enabled: val})
                  updateApiStatus(editForm.id, val)
                    .then(() => {
                      message.success(val ? 'Enabled' : 'Closed');
                      reqApiList();
                    });
                }}/>
              </Flex>
            </Col>
            <Col span={24}>
              <Tabs size="small" defaultActiveKey="graphql" items={items} onChange={onChange}/>
            </Col>
          </Row>
        </Col>
        <Drawer
          open={drawerVisible}
          onClose={() => setDrawerVisible(false)}
          width="95%"
          title="API design"
          footer={
            <div style={{textAlign: 'center'}}>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button type="primary">
                Create
              </Button>
            </div>
          }
        >
          {/*{viewType === 'GRAPH_QL' && <GraphQL/>}*/}
        </Drawer>
        <Modal
          open={apiDialogVisible}
          width={600}
          onCancel={() => setApiDialogVisible(false)}
          footer={null}
        >
        </Modal>
        <Modal
          open={deleteDialogVisible}
          onOk={handleDelete}
          onCancel={() => setDeleteDialogVisible(false)}
          title={`Delete '${selectedNode?.data?.name}?'`}
          okText="Delete"
          okButtonProps={{danger: true}}
        >
        <span>
          Are you sure you want to delete <strong>{selectedNode?.data?.name}</strong>?
        </span>
        </Modal>
      </Row>
    </>
  )
};

export default ApiManagement
