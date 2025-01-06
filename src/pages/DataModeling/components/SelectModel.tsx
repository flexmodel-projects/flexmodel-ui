import React, {useEffect, useRef, useState} from 'react';
import {Button, Divider, Dropdown, Input, Menu, Modal, Select, Space, Spin, Tree} from 'antd';
import {DeleteOutlined, EditOutlined, MoreOutlined, PlusOutlined, ReloadOutlined} from '@ant-design/icons';
import {getDatasourceList} from '../../../api/datasource';
import {createModel as reqCreateModel, dropModel, getModelList} from '../../../api/model';
import {useNavigate} from "react-router-dom";
import CreateEntity from "./CreateEntity.tsx";
import {Datasource, Model} from "../data";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "../../../store/configStore.ts";

interface ModelTree {
  name: string;
  children?: ModelTree[];
}

interface SelectModelProps {
  datasource?: string;
  editable: boolean;
  onChange: (ds: string, model: Model) => void;
}

const SelectModel: React.FC<SelectModelProps> = ({datasource, editable, onChange}) => {

  const {t} = useTranslation();
  const {locale} = useSelector((state: RootState) => state.locale);
  const navigate = useNavigate();
  const [activeDs, setActiveDs] = useState<string>(datasource || "system");
  const [dsList, setDsList] = useState<Datasource[]>([]);
  const [modelList, setModelList] = useState<ModelTree[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [filteredModelList, setFilteredModelList] = useState<ModelTree[]>([]); // 增加状态来保存过滤后的数据
  const [activeModel, setActiveModel] = useState<ModelTree | null>(null);
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
    const groupData = groupByType(res);
    setModelList(groupData);
    setFilteredModelList(groupData); // 初始化时未过滤
    setExpandedKeys([groupData[0]?.key]);
    setActiveModel(activeModel || res[0] || null);
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
    await reqModelList();
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
  const filterModelTree = (models: ModelTree[], searchText: string): ModelTree[] => {
    return models
      .map(model => {
        const filteredChildren = model.children ? filterModelTree(model.children, searchText) : [];
        if (model.name.toLowerCase().includes(searchText.toLowerCase()) || filteredChildren.length > 0) {
          return {...model, children: filteredChildren};
        }
        return null;
      })
      .filter(Boolean) as ModelTree[];
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

  useEffect(() => {
    reqModelList();
  }, [locale]);

  const onExpand = (expandedKeys: any) => {
    setExpandedKeys(expandedKeys);
  };

  /**
   * 按照 type 分组并生成特定结构
   * @param {Array} data - 输入的数据数组
   * @returns {Array} - 转换后的分组结构
   */
  const groupByType = (data: any): any[] => {
    const r = Object.values(
      data.reduce((acc: any, item: any) => {
        const {type, name, ...rest} = item;

        // 如果分组不存在，则创建分组
        if (!acc[type]) {
          acc[type] = {
            type: type === "entity" ? "entity_group" : type === "native_query" ? "native_query_group" : "other",
            key: type,
            name: type === "entity" ? t('entities') : type === "native_query" ? t('native_queries') : "Other",
            children: [],
            isLeaf: false
          };
        }

        // 将当前对象放入对应的 children 数组中
        acc[type].children.push({name, type, key: name, isLeaf: true, ...rest});
        return acc;
      }, {})
    );
    return r;
  }

  return (
    <div>
      <Select
        value={activeDs}
        onChange={onSelectDatasource}
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
            {t('management')}
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
        {editable &&
          <Dropdown overlay={
            <Menu>
              <Menu.Item onClick={() => setCreateDrawerVisible(true)}>{t('new_entity')}</Menu.Item>
              <Menu.Item onClick={() => null} disabled>{t('new_native_query')}</Menu.Item>
            </Menu>
          }>
            <Button icon={<PlusOutlined/>}/>
          </Dropdown>
        }
        <Input
          placeholder={t('search_models')}
          value={filterText}
          onChange={handleSearchChange} // 绑定搜索框变化事件
          style={{width: '100%'}}
          allowClear
        />
      </Space>
      <Divider/>
      <Spin spinning={modelLoading}>
        <Tree
          ref={treeRef}
          height={380}
          treeData={filteredModelList} // 使用过滤后的数据
          expandedKeys={expandedKeys}
          onExpand={onExpand}
          fieldNames={{key: 'key', title: 'name', children: 'children'}}
          selectedKeys={[activeModel?.name || '']}
          onSelect={(_, {node}) => handleItemChange(node)}
          titleRender={(node: any) => (
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '220px'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Space>
                  <span title={node.name}
                        style={{textOverflow: 'ellipsis', overflow: 'hidden', width: '180px', display: 'block'}}>
                    {node.name}
                  </span>
                </Space>
              </div>
              {editable && node?.isLeaf && (
                <Dropdown
                  overlay={
                    <Menu onClick={handleMenuClick}>
                      <Menu.Item key="delete" style={{color: 'red'}} icon={<DeleteOutlined/>}>
                        {t('delete')}
                      </Menu.Item>
                    </Menu>
                  }
                >
                  <MoreOutlined style={{cursor: 'pointer'}}/>
                </Dropdown>
              )}
            </div>
          )}
        />
      </Spin>
      <Modal
        title={`${t('delete')} '${activeModel?.name}'?`}
        open={deleteDialogVisible}
        onCancel={() => setDeleteDialogVisible(false)}
        onOk={handleDelete}
      >
        {t('delete_dialog_text', {name: activeModel?.name})}
      </Modal>
      <CreateEntity visible={createDrawerVisible} datasource={activeDs} onConfirm={addModel}
                    onCancel={() => setCreateDrawerVisible(false)}/>
    </div>
  );
};

export default SelectModel;
