import React, {useEffect, useState} from 'react';
import {Button, Card, Divider, Dropdown, Menu, message, Modal, Space, Spin, Tree} from 'antd';
import Icon, {BlockOutlined, DeleteOutlined, MoreOutlined} from '@ant-design/icons';
import DatabaseInfo from "./components/DatabaseInfo.tsx";
import EditDSConfig from "./components/EditDatabaseModal.tsx";
import ConnectDatabaseDrawer from "./components/ConnectDatabaseDrawer.tsx";
import {
  deleteDatasource,
  getDatasourceList,
  refreshDatasource as reqRefreshDatasource,
  updateDatasource,
  validateDatasource
} from "../../api/datasource.ts";
import {DbsMap} from "../DataModeling/components/types.ts";
import {useNavigate} from "react-router-dom";

const DatasourceManagement: React.FC = () => {

  const navigate = useNavigate();

  const [dsList, setDsList] = useState<any[]>([]);
  const [activeDs, setActiveDs] = useState<any>({config: {dbKind: ''}, createTime: '', name: '', type: ''});
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  const fetchDatasourceList = async () => {
    try {
      setDsLoading(true);
      const list = await getDatasourceList();
      setDsList(list);
      if (!activeDs.name) {
        setActiveDs(list[0]);
      }
    } catch (error) {
      message.error('Failed to load datasource list.');
      console.error(error);
    } finally {
      setDsLoading(false);
    }
  };

  useEffect(() => {
    fetchDatasourceList();
  }, []);

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await reqRefreshDatasource(activeDs.name);
      message.success('Refresh succeeded');
    } catch (error) {
      console.error(error)
      message.error('Failed to refresh datasource.');
    } finally {
      setRefreshLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setTestLoading(true);
    try {
      const result = await validateDatasource(activeDs);
      if (result.success) {
        message.success(`Succeed, ping: ${result.time}ms`);
      } else {
        message.error(`Failed, error msg: ${result.errorMsg}`);
      }
    } catch (error) {
      console.log(error)
      message.error('Failed to test connection.');
    } finally {
      setTestLoading(false);
    }
  };

  const handleEdit = async (formData: any) => {
    try {
      const res = await updateDatasource(formData.name, {
        config: {
          dbKind: formData.dbKind,
          username: formData.username,
          password: formData.password,
          url: formData.url,
        }
      });
      setEditVisible(false);
      setActiveDs(res);
      fetchDatasourceList();
    } catch (error) {
      console.error(error)
      message.error('Failed to update datasource.');
    }
  };

  const handleDelete = async () => {
    await deleteDatasource(activeDs.name);
    const list = await getDatasourceList();
    setDsList(list);
    setDeleteVisible(false);
  };

  const handleTreeClick = (item: any) => {
    console.log(item)
    setActiveDs(item);
  };

  return (
    <>
      <div style={{display: 'flex'}}>
        <Card style={{width: '25%'}}>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>DS management</div>
          <Divider/>
          <Spin spinning={dsLoading}>
            <Tree
              treeData={dsList.map(ds => ({
                ...ds,
                title: ds.name,
                key: ds.name,
              }))}
              selectedKeys={[activeDs.name]}
              titleRender={(node) => (
                <div style={{display: 'flex', alignItems: 'center', width: '250px'}}>
                  {<Icon component={DbsMap[node.config?.dbKind]}/>}&nbsp;<span>{node.title}</span>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
                          style={{color: 'red'}}
                          icon={<DeleteOutlined/>}
                          disabled={activeDs.type === 'system'}
                          onClick={() => {
                            setDeleteVisible(true);
                          }}
                        >
                          Delete
                        </Menu.Item>
                      </Menu>
                    }
                    trigger={['hover']}
                    placement="bottomRight"
                  >
                    <MoreOutlined style={{marginLeft: 'auto', cursor: 'pointer'}}/>
                  </Dropdown>
                </div>
              )}
              onSelect={(_, {node}) => handleTreeClick(node)}
            />
          </Spin>
          <Divider/>
          <Button
            type="primary"
            icon={<BlockOutlined/>}
            onClick={() => setDrawerVisible(true)}
            style={{width: '100%'}}
            ghost
          >
            Connect Database
          </Button>
        </Card>
        <div style={{width: '75%'}}>
          <Card>
            <div style={{display: 'flex', justifyContent: 'space-between'}}>
              <div>{activeDs.name}</div>
              <div>
                <Space>
                  <Button onClick={() => {navigate(`/modeling?datasource=${activeDs.name}`)
                  }}>Modeling</Button>
                  <Button onClick={handleRefresh} loading={refreshLoading}>Refresh</Button>
                  <Button onClick={handleTestConnection} loading={testLoading}>Test</Button>
                  <Button
                    type="primary"
                    disabled={activeDs.type === 'system'}
                    onClick={() => setEditVisible(true)}
                  >
                    Edit
                  </Button>
                </Space>
              </div>
            </div>
          </Card>
          <Card>
            <DatabaseInfo datasource={activeDs}/>
          </Card>
        </div>
      </div>
      <ConnectDatabaseDrawer visible={drawerVisible} onChange={(data) => {
        fetchDatasourceList();
        setActiveDs(data);
      }} onClose={() => {
        setDrawerVisible(false);
      }}/>
      <EditDSConfig
        visible={editVisible}
        datasource={activeDs}
        onConform={handleEdit}
        onCancel={() => setEditVisible(false)}
      />
      <Modal
        open={deleteVisible}
        title={`Delete '${activeDs?.name}?'`}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        cancelText="Cancel"
      >
        <p>Are you sure you want to delete <strong>{activeDs?.name}</strong>?</p>
      </Modal>
    </>
  );
};

export default DatasourceManagement;
