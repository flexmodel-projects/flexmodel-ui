import React, { useState, useEffect } from 'react';
import { Button, Card, Divider, Dropdown, Menu, Modal, Spin, Tree, message } from 'antd';
import { MoreOutlined, DatabaseOutlined } from '@ant-design/icons';
import DatabaseInfo from "./components/DatabaseInfo.tsx";
import EditDSConfig from "./components/EditDatabaseDrawer.tsx";
import ConnectDatabaseDrawer from "./components/ConnectDatabaseDrawer.tsx";
import { getDatasourceList, refreshDatasource as reqRefreshDatasource, updateDatasource, validateDatasource, deleteDatasource } from "../../api/datasource.ts";


const { DirectoryTree } = Tree;

const DatasourceManagement: React.FC = () => {
  const [dsList, setDsList] = useState<any[]>([]);
  const [activeDs, setActiveDs] = useState<any>({ config: { dbKind: '' }, createTime: '', name: '', type: '' });
  const [dsLoading, setDsLoading] = useState<boolean>(false);
  const [refreshLoading, setRefreshLoading] = useState<boolean>(false);
  const [testLoading, setTestLoading] = useState<boolean>(false);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchDatasourceList = async () => {
      try {
        setDsLoading(true);
        const list = await getDatasourceList();
        setDsList(list);
        setActiveDs(list[0]);
      } catch (error) {
        message.error('Failed to load datasource list.');
        console.error(error);
      } finally {
        setDsLoading(false);
      }
    };
    fetchDatasourceList();
  }, []);

  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await reqRefreshDatasource(activeDs.name);
      message.success('Refresh succeeded');
    } catch (error) {
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
      message.error('Failed to test connection.');
    } finally {
      setTestLoading(false);
    }
  };

  const handleEdit = async () => {
    try {
      await updateDatasource(activeDs.name, activeDs);
      setEditVisible(false);
    } catch (error) {
      message.error('Failed to update datasource.');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDatasource(activeDs.name);
      const list = await getDatasourceList();
      setDsList(list);
      setDeleteVisible(false);
    } catch (error) {
      message.error('Failed to delete datasource.');
    }
  };

  const handleTreeClick = (item: any) => {
    setActiveDs(item);
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Card style={{ width: '25%' }}>
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>DS management</div>
          <Divider />
          <Spin spinning={dsLoading}>
            <DirectoryTree
              treeData={dsList.map(ds => ({
                title: ds.name,
                key: ds.name,
                icon: <DatabaseOutlined />
              }))}
              defaultExpandAll
              selectedKeys={[activeDs.name]}
              titleRender={(node) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DatabaseOutlined style={{ marginRight: 8 }} />
                  <span>{node.title}</span>
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item
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
                    <MoreOutlined style={{ marginLeft: 'auto', cursor: 'pointer' }} />
                  </Dropdown>
                </div>
              )}
              onSelect={(_, { node }) => handleTreeClick(node)}
            />
          </Spin>
          <Divider />
          <Button
            type="primary"
            icon={<DatabaseOutlined />}
            onClick={() => setDrawerVisible(true)}
            style={{ width: '100%' }}
          >
            Connect Database
          </Button>
        </Card>
        <div style={{ width: '75%' }}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>{activeDs.name}</div>
              <div>
                <Button onClick={() => {/* router.push(`/modeling?datasource=${activeDs.name}`) */}}>Modeling</Button>
                <Button onClick={handleRefresh} loading={refreshLoading}>Refresh</Button>
                <Button onClick={handleTestConnection} loading={testLoading}>Test</Button>
                <Button
                  type="primary"
                  disabled={activeDs.type === 'system'}
                  onClick={() => setEditVisible(true)}
                >
                  Edit
                </Button>
              </div>
            </div>
          </Card>
          <Card>
            <DatabaseInfo datasource={activeDs} />
          </Card>
        </div>
      </div>
      <ConnectDatabaseDrawer visible={drawerVisible} onChange={() => fetchDatasourceList()} onClose={() => setDrawerVisible(false)} />
      <EditDSConfig
        visible={editVisible}
        datasource={activeDs}
        onConfirm={handleEdit}
        onCancel={() => setEditVisible(false)}
        onClose={() => setEditVisible(false)}
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
