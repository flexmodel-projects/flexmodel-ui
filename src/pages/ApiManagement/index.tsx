import React, {useContext, useEffect, useRef, useState} from "react";
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Drawer,
  Dropdown,
  Flex,
  Input,
  Menu,
  message,
  Modal,
  Row,
  Select, Space,
  Switch,
  Tree,
} from "antd";
import {DeleteOutlined, MoreOutlined, SaveOutlined, TableOutlined} from "@ant-design/icons";
import {deleteApi, getApis, updateApi} from "../../api/api-info.ts";
import "./index.css";
import {css} from '@emotion/css';
import GraphQL from "./components/GraphQL.tsx";
import HoverEditInput from "./components/HoverEditInput.tsx";

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
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false)
  const [apiList, setApiList] = useState<ApiInfo[]>([])
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false)
  const [apiDialogVisible, setApiDialogVisible] = useState<boolean>(false)
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null)
  const [editNode, setEditNode] = useState<string>("")
  const [editForm, setEditForm] = useState<any>({})
  const treeRef = useRef<any>(null) // 使用 `any` 类型避免过于严格的类型检查

  useEffect(() => {
    setEditForm(selectedNode?.data)
  }, [selectedNode])

  useEffect(() => {
  }, [editForm])

  // 请求 API 列表数据
  useEffect(() => {
    reqApiList()
  }, [])

  // 请求 API 列表数据
  const reqApiList = async () => {
    const apis = await getApis()
    setApiList(apis)
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
  const {getPrefixCls} = useContext(ConfigProvider.ConfigContext)
  const rootPrefixCls = getPrefixCls()

  const linearGradientButton = css`
    &.${rootPrefixCls}-btn-primary:not([disabled]):not(.${rootPrefixCls}-btn-dangerous) {
      border-width: 0;

      > span {
        position: relative;
      }

      &::before {
        content: '';
        background: linear-gradient(135deg, #6253E1, #04BEFE)
        position: absolute;
        inset: 0;
        opacity: 1;
        transition: all 0.3s;
        border-radius: inherit;
      }

      &:hover::before {
        opacity: 0;
      }
    }
  `;

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
              <HoverEditInput onChange={editApi} value={editForm.name || ''}/>
            ) : (
              item.name
            )}
              <Dropdown
                overlay={
                  <Menu>
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

  return (
    <>
      <Row>
        <Col span={5}>
          <Card>
            <Search style={{marginBottom: 8}} placeholder="Search"/>
            <DirectoryTree
              ref={treeRef}
              treeData={renderTreeNodes(apiList)}
              onSelect={(_, {node}) => handleNodeClick(node)}
              height={538}
            />
            <Button
              type="link"
              onClick={() => setApiDialogVisible(true)}
            >New</Button>
            or
            <Button
              type="link"
              onClick={() => setApiDialogVisible(true)}
            >Batch create</Button>
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
                <ConfigProvider
                  button={{
                    className: linearGradientButton,
                  }}
                >
                  <Button type="primary" onClick={handleSaveApi} icon={<SaveOutlined/>}>
                    Save
                  </Button>
                  <Switch/>
                </ConfigProvider>
              </Flex>
            </Col>
            <Col span={24}>
              <GraphQL onChange={value => setEditForm({...editForm, meta: {...editForm?.meta, execution: value}})}
                       data={selectedNode?.data?.meta?.execution}/>
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
          {/*<Row gutter={[10, 10]}>
          {Endpoints.map((item, index) => (
            <Col key={index} span={6}>
              <Card
                hoverable
                onClick={() => toApiDesign(item)}
              >
                <div className="text-center">
                  <div className="mb-12px flex items-center">
                    <item.icon style={{ fontSize: 50, marginRight: 16 }} />
                    {!item.enable && (
                      <Tag color="warning" className="dev-tag">
                        Coming soon...
                      </Tag>
                    )}
                  </div>
                  <p>{item.name}</p>
                </div>
              </Card>
            </Col>
          ))}
        </Row>*/}
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
