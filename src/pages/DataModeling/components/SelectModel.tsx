import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Dropdown, Input, Menu, Modal, Select, Space, Spin, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, MoreOutlined, ReloadOutlined, TableOutlined} from '@ant-design/icons';
import {getDatasourceList, refreshDatasource as reqRefreshDatasource} from '../../../api/datasource';
import {dropModel, getModelList} from '../../../api/model';
import {css} from "@emotion/css";
import {useNavigate} from "react-router-dom";

interface Datasource {
  name: string;
  config?: { dbKind?: string };
}

interface Model {
  name: string;
  children?: Model[];
}

const SelectModel: React.FC<{
  datasource: string;
  editable: boolean;
  onChange: (ds: string, model: Model) => void;
}> = ({datasource, editable, onChange}) => {

  const navigate = useNavigate();
  const [activeDs, setActiveDs] = useState<string>(datasource);
  const [dsList, setDsList] = useState<Datasource[]>([]);
  const [modelList, setModelList] = useState<Model[]>([]);
  const [activeModel, setActiveModel] = useState<Model | null>(null);
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] = useState<boolean>(false);
  const [filterText, setFilterText] = useState<string>('');
  const treeRef = useRef<any>(null);

  const reqDatasourceList = async () => {
    const res = await getDatasourceList();
    setDsList(res);
    setActiveDs(datasource || res[0].name);
  };

  const reqModelList = async () => {
    setModelLoading(true);
    const res: Model[] = await getModelList(activeDs);
    setModelLoading(false);
    setModelList(res);
    setActiveModel(res[0] || null);
    onChange(activeDs, res[0] || null);
  };

  const onQueryChanged = (query: string) => {
    setFilterText(query);
    if (treeRef.current) {
      treeRef.current.filter(query);
    }
  };

  const handleItemChange = (item: Model) => {
    setActiveModel(item);
    onChange(activeDs, item);
  };

  const refreshDatasource = async () => {
    setDsLoading(true);
    await reqRefreshDatasource(activeDs);
    setDsLoading(false);
  };

  const handleDelete = async () => {
    if (activeModel) {
      await dropModel(activeDs, activeModel.name);
      await reqModelList();
      setDeleteDialogVisible(false);
    }
  };

  const onSelectDatasource = (value: string) => {
    setActiveDs(value);
  };

  const handleMenuClick = (e: any) => {
    if (e.key === 'delete') {
      setDeleteDialogVisible(true);
    }
  };

  useEffect(() => {
    reqDatasourceList();
  }, []);

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
      <Input
        placeholder="Search models"
        value={filterText}
        onChange={e => onQueryChanged(e.target.value)}
        style={{width: '100%'}}
        allowClear
      />
      <Divider/>
      <Spin spinning={modelLoading}>
        <Tree
          className={css`
            .ant-tree-switcher {
              display: none;
            }
          `}
          ref={treeRef}
          height={300}
          treeData={modelList}
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
        visible={deleteDialogVisible}
        onCancel={() => setDeleteDialogVisible(false)}
        onOk={handleDelete}
      >
        <p>Are you sure you want to delete <strong>{activeModel?.name}</strong>?</p>
      </Modal>
    </div>
  );
};

export default SelectModel;
