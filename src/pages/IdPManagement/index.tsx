import React, {useEffect, useState} from 'react';
import {Button, Card, Col, Divider, Dropdown, Empty, message, Modal, Row, Tree} from 'antd';
import {MoreOutlined} from '@ant-design/icons';
import {deleteIdentityProvider, getIdentityProviders, updateIdentityProvider} from '../../api/identity-provider';
import IdPInfo from "./components/IdPInfo.tsx";
import EditProvider from "./components/EditProvider.tsx";
import CreateProvider from "./components/CreateProvider.tsx";

interface IdentityProvider {
  name: string;
  provider?: {
    type: string
    issuer: string
    clientId: string
    clientSecret: string
  };
  type?: string;
  children?: IdentityProvider[];
}

const treeProps = {
  title: 'name',
  key: 'name',
  children: 'children',
};

const IdPManagement: React.FC = () => {
  const [idPList, setIdPList] = useState<IdentityProvider[]>([]);
  const [activeIdP, setActiveIdP] = useState<IdentityProvider | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  const [deleteVisible, setDeleteVisible] = useState<boolean>(false);
  const [editForm, setEditForm] = useState<IdentityProvider | null>(null);

  const fetchIdentityProviders = async () => {
    try {
      const data = await getIdentityProviders();
      setIdPList(data);
      setActiveIdP(data[0] || null);
    } catch (error) {
      console.log(error)
      message.error('Failed to load identity providers.');
    }
  };

  useEffect(() => {
    fetchIdentityProviders();
  }, []);

  const handleDelete = async () => {
    if (activeIdP) {
      try {
        await deleteIdentityProvider(activeIdP.name);
        fetchIdentityProviders();
        setDeleteVisible(false);
        message.success('Deleted successfully');
      } catch {
        message.error('Failed to delete provider');
      }
    }
  };

  const handleEditProvider = async () => {
    if (editForm) {
      try {
        await updateIdentityProvider(editForm.name, editForm);
        setEditVisible(false);
        fetchIdentityProviders();
        message.success('Updated successfully');
      } catch {
        message.error('Failed to update provider');
      }
    }
  };

  const handleItemClick = (item: IdentityProvider) => {
    setActiveIdP(item);
  };

  return (
    <Row gutter={16}>
      <Col span={4}>
        <Card title="IdP management" bordered={false}>
          <Divider/>
          <Tree
            treeData={idPList}
            fieldNames={treeProps}
            defaultExpandAll
            selectedKeys={activeIdP ? [activeIdP.name] : []}
            onSelect={(_, {node}) => handleItemClick(node as IdentityProvider)}
            titleRender={(nodeData: any) => (
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <div>{nodeData.name}</div>
                {nodeData.type !== 'system' && (
                  <Dropdown
                    trigger={['click']}
                    menu={{
                      items: [
                        {
                          key: 'delete',
                          label: <span style={{color: '#f56c6c'}}>Delete</span>,
                          onClick: () => {
                            setActiveIdP(nodeData);
                            setDeleteVisible(true);
                          },
                        },
                      ],
                    }}
                  >
                    <MoreOutlined style={{cursor: 'pointer'}}/>
                  </Dropdown>
                )}
              </div>
            )}
          />
          <Button type="primary" icon={<MoreOutlined/>} onClick={() => setDrawerVisible(true)} block ghost>
            New provider
          </Button>
        </Card>
      </Col>

      <Col span={20}>
        {idPList.length > 0 && activeIdP ? (
          <>
            <Row>
              <Col span={24}>
                <Card bordered={false}>
                  <Row justify="space-between">
                    <Col>{activeIdP.name}</Col>
                    <Col>
                      <Button
                        type="primary"
                        onClick={() => {
                          setEditForm(activeIdP);
                          setEditVisible(true);
                        }}
                      >
                        Edit
                      </Button>
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col span={24}>
                <Card bordered={false}>
                  <IdPInfo data={activeIdP}/>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Row justify="center">
            <Empty/>
          </Row>
        )}
      </Col>

      <CreateProvider visible={drawerVisible} onClose={() => setDrawerVisible(false)}
                      onChange={fetchIdentityProviders}/>
      <EditProvider
        visible={editVisible}
        form={editForm}
        onCancel={() => setEditVisible(false)}
        onConfirm={handleEditProvider}
      />
      <Modal
        visible={deleteVisible}
        title={`Delete '${activeIdP?.name}'?`}
        onCancel={() => setDeleteVisible(false)}
        onOk={handleDelete}
        okText="Delete"
        okButtonProps={{danger: true}}
      >
        <p>Are you sure you want to delete <strong>{activeIdP?.name}</strong>?</p>
      </Modal>
    </Row>
  );
};

export default IdPManagement;
