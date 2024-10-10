import React, {useEffect, useRef, useState} from "react";
import {
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
  Switch,
  Tabs,
  TabsProps,
  Tree,
} from "antd";
import {MoreOutlined, SaveOutlined} from "@ant-design/icons";
import {createApi, deleteApi, getApis, updateApi, updateApiName, updateApiStatus} from "../../api/api-info.ts";
import "./index.css";
import GraphQL from "./components/GraphQL.tsx";
import HoverEditInput from "./components/HoverEditInput.tsx";
import Authorization from "./components/Authorization.tsx";

const {Search} = Input;
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
    const apis = await getApis()
    setApiList(apis)
    return apis;
  };

  // 节点点击处理
  const handleNodeClick = (nodeData: TreeNode) => {
    console.log(nodeData)
    setSelectedNode(nodeData)
  };

  // 进入 API 设计界面
  /*  const toApiDesign = (item: Endpoint) => {
      if (!item.enable) {
        message.warning("Not available")
        return;
      }
      setViewType(item.type)
      setApiDialogVisible(false)
      setDrawerVisible(true)
    };*/

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
  const editApi = async () => {
    setEditNode('')
    if (editForm.id) {
      await updateApi(editForm.id, editForm)
      await reqApiList()
    }
  };

  // 编辑 API
  const renameApi = async (name: string) => {
    setEditNode('')
    if (editForm.id) {
      await updateApiName(editForm.id, name)
      await reqApiList()
    }
  };

  const addApi = async (parentId: string) => {
    const reqData = {parentId: parentId, name: 'New API', type: 'API', method: 'GET', meta: {}};
    await createApi(reqData);
    await reqApiList();
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
      isLeaf: item.children?.length == 0,
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

  return (
    <>
      <Row>
        <Col span={5}>
          <Card>
            <Search style={{marginBottom: 8}} placeholder="Search"/>
            <DirectoryTree
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              ref={treeRef}
              treeData={renderTreeNodes(apiList)}
              onSelect={(selectedKeys, {node}) => {
                setSelectedKeys(selectedKeys);
                handleNodeClick(node);
              }}
              height={538}
            />
            {/*<Button
              type="link"
              onClick={() => setApiDialogVisible(true)}
            >New</Button>
            or
            <Button
              type="link"
              onClick={() => setApiDialogVisible(true)}
            >Batch create</Button>*/}
          </Card>
        </Col>
        <Col span={19} style={{paddingLeft: '10px'}}>
          <Row>
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
