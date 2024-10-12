import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Dropdown, Input, Menu, Modal, Select, Space, Spin, Tree} from 'antd';
import {
  DeleteOutlined,
  EditOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  TableOutlined
} from '@ant-design/icons';
import {getDatasourceList, refreshDatasource as reqRefreshDatasource} from '../../../api/datasource';
import {createModel as reqCreateModel, dropModel, getModelList} from '../../../api/model';
import {css} from "@emotion/css";
import {useNavigate} from "react-router-dom";
import CreateModel from "./CreateModel.tsx";

interface Datasource {
  name: string;
  config?: { dbKind?: string };
}

interface Model {
  name: string;
  children?: Model[];
}

interface SelectModelProps {
  datasource: string;
  editable: boolean;
  onChange: (ds: string, model: Model) => void;
}

const SelectModel: React.FC<SelectModelProps> = ({datasource, editable, onChange}) => {

  const navigate = useNavigate();
  const [activeDs, setActiveDs] = useState<string>(datasource);
  const [dsList, setDsList] = useState<Datasource[]>([]);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [filteredModelList, setFilteredModelList] = useState<Model[]>([]); // 增加状态来保存过滤后的数据
  const [activeModel, setActiveModel] = useState<Model | null>(null);
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [filterText, setFilterText] = useState<string>(''); // 监听搜索框输入
  const treeRef = useRef<any>(null);
  // 添加模型
  const addModel = async (item: any) => {
    await reqCreateModel(activeDs, item);
    setCreateDrawerVisible(false);
    await reqModelList();
  };

  // 获取数据源列表
  const reqDatasourceList = async () => {
    const res = await getDatasourceList();
    setDsList(res);
    setActiveDs(datasource || res[0].name);
  };

  // 获取模型列表
  const reqModelList = async () => {
    setModelLoading(true);
    const res: Model[] = await getModelList(activeDs);
    setModelLoading(false);
    setModelList(res);
    setFilteredModelList(res); // 初始化时未过滤
    setActiveModel(res[0] || null);
    onChange(activeDs, res[0] || null);
  };

  // 处理模型选择
  const handleItemChange = (item: Model) => {
    setActiveModel(item);
    onChange(activeDs, item);
  };

  // 刷新数据源
  const refreshDatasource = async () => {
    setDsLoading(true);
    await reqRefreshDatasource(activeDs);
    setDsLoading(false);
  };

  // 删除模型
  const handleDelete = async () => {
    if (activeModel) {
      await dropModel(activeDs, activeModel.name);
      await reqModelList();
      setDeleteDialogVisible(false);
    }
  };

  // 选择数据源
  const onSelectDatasource = (value: string) => {
    setActiveDs(value);
  };

  // 处理菜单点击
  const handleMenuClick = (e: any) => {
    if (e.key === 'delete') {
      setDeleteDialogVisible(true);
    }
  };

  // 过滤树形结构数据
  const filterModelTree = (models: Model[], searchText: string): Model[] => {
    return models
      .map(model => {
        const filteredChildren = model.children ? filterModelTree(model.children, searchText) : [];
        if (model.name.toLowerCase().includes(searchText.toLowerCase()) || filteredChildren.length > 0) {
          return {...model, children: filteredChildren};
        }
        return null;
      })
      .filter(Boolean) as Model[];
  };

  // 搜索框变化时，更新过滤的树数据
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilterText(value);
    if (value) {
      const filteredData = filterModelTree(modelList, value);
      setFilteredModelList(filteredData);
    } else {
      setFilteredModelList(modelList);
    }
  };

  // 获取数据源列表时执行
  useEffect(() => {
    reqDatasourceList();
  }, []);

  // 获取模型列表时执行
  useEffect(() => {
    if (activeDs) {
      reqModelList();
    }
  }, [activeDs]);

  return (
    <div>
      <Select
        value={activeDs}
        onChange={onSelectDatasource}
        placeholder="Data source"
        style={{width: 'calc(100% - 50px)'}}
      >
        {dsList.map(item => (
          <Select.Option key={item.name} value={item.name}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              {item.name}
            </div>
          </Select.Option>
        ))}
        <Select.Option value="manage" disabled>
          <Button
            type="link"
            icon={<EditOutlined/>}
            style={{width: '100%'}}
            onClick={() => navigate('/datasource')}
          >
            Management
          </Button>
        </Select.Option>
      </Select>
      <Button
        icon={<ReloadOutlined/>}
        onClick={refreshDatasource}
        loading={dsLoading}
        style={{marginLeft: 8}}
      />
      <Divider/>
      <Space>
        <Dropdown overlay={
          <Menu>
            <Menu.Item onClick={() => setCreateDrawerVisible(true)}>New Entity</Menu.Item>
            <Menu.Item onClick={() => null} disabled>New Enum</Menu.Item>
          </Menu>
        }>
          <Button icon={<PlusOutlined/>}/>
        </Dropdown>
        <Input
          placeholder="Search Models"
          value={filterText}
          onChange={handleSearchChange} // 绑定搜索框变化事件
          style={{width: '100%'}}
          allowClear
        />
      </Space>
      <Divider/>
      <Spin spinning={modelLoading}>
        <Tree
          className={css`
            .ant-tree-switcher {
              display: none;
            }
          `}
          ref={treeRef}
          height={380}
          treeData={filteredModelList} // 使用过滤后的数据
          fieldNames={{key: 'name', title: 'name', children: 'children'}}
          selectedKeys={[activeModel?.name || '']}
          onSelect={(_, {node}) => handleItemChange(node)}
          titleRender={node => (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '220px'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Space>
                  <TableOutlined/>
                  <span title={node.name}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', width: '180px', display: 'block'}}>
                    {node.name}
                  </span>
                </Space>
              </div>
              {editable && (
                <Dropdown
                  overlay={
                    <Menu onClick={handleMenuClick}>
                      <Menu.Item key="delete" style={{color: 'red'}} icon={<DeleteOutlined/>}>
                        Delete
                      </Menu.Item>
                    </Menu>
                  }
                  trigger={['click']}
                >
                  <MoreOutlined style={{cursor: 'pointer'}}/>
                </Dropdown>
              )}
            </div>
          )}
        />
      </Spin>
      <Modal
        title={`Delete '${activeModel?.name}'?`}
        open={deleteDialogVisible}
        onCancel={() => setDeleteDialogVisible(false)}
        onOk={handleDelete}
      >
        <p>Are you sure you want to delete <strong>{activeModel?.name}</strong>?</p>
      </Modal>
      <CreateModel visible={createDrawerVisible} datasource={activeDs} onConform={addModel}
                   onCancel={() => setCreateDrawerVisible(false)}/>
    </div>
  );
};

export default SelectModel;
