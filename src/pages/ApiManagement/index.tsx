import React, {useEffect, useRef, useState} from "react";
import {Button, Card, Col, Drawer, Dropdown, Input, Menu, Modal, Row, Tree,} from "antd";
import {MoreOutlined, PlusOutlined} from "@ant-design/icons";
import {deleteApi, getApis, updateApi} from "../../api/api-info.ts";
import GraphQL from "./components/GraphQL";
import HoverEditInput from "./components/HoverEditInput.tsx";
import "./index.css";

const {Search} = Input;
const {DirectoryTree} = Tree;

// 定义 Tree 数据类型
interface TreeNode {
  id: string;
  name: string;
  type?: string;
  method?: string;
  children?: TreeNode[];
  settingVisible?: boolean;
}

const ApiManagement: React.FC = () => {
  // 状态定义
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [viewType, setViewType] = useState<"REST_API" | "GRAPH_QL" | "DEFAULT_PAGE" | string>("DEFAULT_PAGE");
  const [apiList, setApiList] = useState<TreeNode[]>([]);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [apiDialogVisible, setApiDialogVisible] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [editNode, setEditNode] = useState<string>("");
  const [editForm, setEditForm] = useState<Partial<TreeNode>>({});
  const treeRef = useRef<any>(null); // 使用 `any` 类型避免过于严格的类型检查


  // 请求 API 列表数据
  useEffect(() => {
    reqApiList();
  }, []);

  // 请求 API 列表数据
  const reqApiList = async () => {
    const apis = await getApis();
    setApiList(apis);
  };

  // 节点点击处理
  const handleNodeClick = (nodeData: TreeNode) => {
    console.log(nodeData);
    setSelectedNode(nodeData);
  };

  // 进入 API 设计界面
  /*  const toApiDesign = (item: Endpoint) => {
      if (!item.enable) {
        message.warning("Not available");
        return;
      }
      setViewType(item.type);
      setApiDialogVisible(false);
      setDrawerVisible(true);
    };*/

  // 重置为默认页面
  const toDefault = () => {
    setViewType("DEFAULT_PAGE");
    setApiDialogVisible(false);
    reqApiList();
  };

  // 删除处理
  const handleDelete = async () => {
    setDeleteDialogVisible(false);
    if (selectedNode) {
      await deleteApi(selectedNode.id);
      await reqApiList();
    }
  };

  // 显示编辑输入框
  const showEditInput = (data: TreeNode) => {
    setEditForm(data);
    setEditNode(data.id);
  };

  // 编辑 API
  const editApi = async () => {
    setEditNode('');
    if (editForm.id) {
      await updateApi(editForm.id, editForm);
      await reqApiList();
    }
  };

  // 渲染树节点
  const renderTreeNodes = (data: TreeNode[]): any[] =>
    data.map((item) => ({
      title: (
        <>
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
                  setDeleteDialogVisible(true);
                  setSelectedNode(item);
                }}>Delete</Menu.Item>
              </Menu>
            }
            trigger={['hover']}
          >
            <MoreOutlined className={item.settingVisible ? "" : "invisible"} onClick={(e) => e.stopPropagation()}/>
          </Dropdown>
        </>
      ),
      key: item.id,
      isLeaf: item.children?.length == 0,
      children: item.children ? renderTreeNodes(item.children) : [],
    }));

  return (
    <Row>
      <Col span={6}>
        <Card>
          <Search style={{marginBottom: 8}} placeholder="Search"/>
          <DirectoryTree
            ref={treeRef}
            treeData={renderTreeNodes(apiList)}
            onSelect={(_, {node}) => handleNodeClick(node)}
            defaultExpandAll
            height={538}
          />
          <Button
            type="link"
            icon={<PlusOutlined/>}
            onClick={() => setApiDialogVisible(true)}
          >Batch create</Button>
        </Card>
      </Col>
      <Col span={18} style={{paddingLeft: '10px'}}>
        <GraphQL/>
      </Col>
      <Drawer
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        width="95%"
        title="API design"
        footer={
          <div style={{textAlign: 'center'}}>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={toDefault}>
              Create
            </Button>
          </div>
        }
      >
        {viewType === 'GRAPH_QL' && <GraphQL/>}
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
        title={`Delete '${selectedNode?.name}?'`}
        okText="Delete"
        okButtonProps={{danger: true}}
      >
        <span>
          Are you sure you want to delete <strong>{selectedNode?.name}</strong>?
        </span>
      </Modal>
    </Row>
  );
};

export default ApiManagement;
