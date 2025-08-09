import React, {useEffect, useMemo, useState} from "react";
import {Button, Dropdown, Input, Menu, Modal, Select, Spin} from "antd";
import {EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {getDatasourceList} from "@/services/datasource.ts";
import {dropModel, getModelList,} from "@/services/model.ts";
import {useNavigate} from "react-router-dom";
import CreateEntity from "@/pages/DataModeling/components/CreateEntity";
import type {DatasourceSchema} from '@/types/data-source';
import {useTranslation} from "react-i18next";
import {useLocale} from "@/store/appStore.ts";
import CreateNativeQueryModel from "@/pages/DataModeling/components/CreateNativeQueryModel";
import CreateEnum from "@/pages/DataModeling/components/CreateEnum";
import type {Model} from '@/types/data-modeling';
import {
  IconEntityFolder,
  IconEnum,
  IconEnumFolder,
  IconFile,
  IconFolder,
  IconModel
} from '@/components/explore/icons/Icons.jsx';
import '@/components/explore/styles/explore.scss';
import Tree from '@/components/explore/explore/Tree.jsx';
import styles from "@/pages/DataModeling/index.module.scss";

interface ModelTree {
  name: string;
  children?: ModelTree[];
}

interface TreeItem {
  type: 'folder' | 'file';
  filename: string;
  path: string;
  children?: TreeItem[];
  data?: any;
  modelType?: string;
}

interface ModelBrowserProps {
  datasource?: string;
  editable: boolean;
  onSelect: (ds: string, model: Model) => void;
  version?: number;
}

const ModelBrowser: React.FC<ModelBrowserProps> = ({
  datasource,
  editable,
  onSelect,
  version,
}) => {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const navigate = useNavigate();
  const [activeDs, setActiveDs] = useState<string>(datasource || "system");
  const [dsList, setDsList] = useState<DatasourceSchema[]>([]);
  const [modelList, setModelList] = useState<ModelTree[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<any[]>([]);
  const [filteredModelList, setFilteredModelList] = useState<ModelTree[]>([]); // 增加状态来保存过滤后的数据
  const [activeModel, setActiveModel] = useState<any>(null);
  const [modelLoading, setModelLoading] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [
    createNativeQueryModelDrawerVisible,
    setCreateNativeQueryModelDrawerVisible,
  ] = useState(false);
  const [createEnumDrawerVisible, setCreateEnumDrawerVisible] = useState(false);
  const [filterText, setFilterText] = useState<string>(""); // 监听搜索框输入
  // 添加模型
  const addEntity = async () => {
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
    const res: any = await getModelList(activeDs);
    setModelLoading(false);
    const groupData = groupByType(res);
    setModelList(groupData);
    setFilteredModelList(groupData); // 初始化时未过滤
    setExpandedKeys(expandedKeys.length ? expandedKeys : [groupData[0]?.key]);
    const m = activeModel || groupData[0]?.children[0] || null;
    setActiveModel(m);
    onSelect(activeDs, m);
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

  // 过滤树形结构数据
  const filterModelTree = (
    models: ModelTree[],
    searchText: string
  ): ModelTree[] => {
    return models
      .map((model) => {
        const filteredChildren = model.children
          ? filterModelTree(model.children, searchText)
          : [];
        if (
          model.name.toLowerCase().includes(searchText.toLowerCase()) ||
          filteredChildren.length > 0
        ) {
          return { ...model, children: filteredChildren };
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
    if (locale) {
      reqModelList();
    }
  }, [locale]);

  useEffect(() => {
    if (version) {
      reqModelList();
    }
  }, [version]);

  /**
   * 按照 type 分组并生成特定结构
   * @param {Array} data - 输入的数据数组
   * @returns {Array} - 转换后的分组结构
   */
  const groupByType = (data: any): any[] => {
    const groups = data.reduce((acc: any, item: any) => {
      const { type, name, ...rest } = item;
      if (!acc[type]) {
        switch (type) {
          case "ENTITY":
            acc[type] = {
              type: "__entity_group",
              key: "__entity_group",
              name: t("entities"),
              children: [],
              isLeaf: false,
            };
            break;
          case "ENUM":
            acc[type] = {
              type: "__enum_group",
              key: "__enum_group",
              name: t("enums"),
              children: [],
              isLeaf: false,
            };
            break;
          case "NATIVE_QUERY":
            acc[type] = {
              type: "__native_query_group",
              key: "__native_query_group",
              name: t("native_queries"),
              children: [],
              isLeaf: false,
            };
            break;
          default:
            break;
        }
        acc[type].data = { ...acc[type] };
      }
      acc[type]?.children.push({
        name,
        type,
        key: name,
        isLeaf: true,
        ...rest,
        data: item,
      });
      return acc;
    }, {});

    // 自定义排序：先ENTITY，再ENUM，最后NATIVE_QUERY
    const order = ["ENTITY", "ENUM", "NATIVE_QUERY"];
    return order.map((type) => groups[type]).filter(Boolean);
  };

  // 转换modelList为Tree.jsx需要的数据结构
  function convertToTreeData(list: ModelTree[]): TreeItem[] {
    return list.map((group: ModelTree) => ({
      type: 'folder' as const,
      filename: group.name,
      path: (group as any).key || group.name,
      children: (group.children || []).map((item: any) => ({
        type: 'file' as const,
        filename: item.name,
        path: ((group as any).key || group.name) + '/' + item.name,
        data: item.data,
        modelType: item.data?.type, // 新增字段，标记模型类型ENTITY/ENUM/NATIVE_QUERY
      })),
    }));
  }

  const treeData = useMemo(() => ({ children: convertToTreeData(filteredModelList) }), [filteredModelList]);


  const selectRowStyle = {
    display: 'flex',
    alignItems: 'center',
    paddingBottom: '5px',
  };

  const searchRowStyle = {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  };

  const treeContainerStyle = {
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(100vh - 200px)', // 设置最大高度
    overflow: 'auto',
  };

  const selectStyle = {
    width: "100%",
  };

  const inputStyle = {
    width: '100%',
    marginRight: '5px',
  };

  const containerStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  };

  return (
    <div style={containerStyle}>
      <div style={selectRowStyle}>
        <Select
          value={activeDs}
          onChange={onSelectDatasource}
          style={selectStyle}
        >
          {dsList.map((item) => (
            <Select.Option key={item.name} value={item.name}>
              <div style={{
                display: "flex",
                alignItems: "center",
              }}>
                {item.name}
              </div>
            </Select.Option>
          ))}
          <Select.Option value="manage" disabled>
            <Button
              type="link"
              icon={<EditOutlined />}
              style={{
                width: "100%",
                padding: 0,
              }}
              onClick={() => navigate("/datasource")}
            >
              {t("management")}
            </Button>
          </Select.Option>
        </Select>
      </div>
      <div style={searchRowStyle}>
        <Input
          placeholder={t("search_models")}
          value={filterText}
          onChange={handleSearchChange}
          style={inputStyle}
          allowClear
          prefix={
            <SearchOutlined/>
          }
        />
        {editable && (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item onClick={() => setCreateDrawerVisible(true)}>
                  {t("new_entity")}
                </Menu.Item>
                <Menu.Item onClick={() => setCreateEnumDrawerVisible(true)}>
                  {t("new_enum")}
                </Menu.Item>
                <Menu.Item
                  onClick={() => setCreateNativeQueryModelDrawerVisible(true)}
                >
                  {t("new_native_query")}
                </Menu.Item>
              </Menu>
            }
          >
            <Button
              icon={<PlusOutlined />}
            />
          </Dropdown>
        )}
      </div>

      {/* 树形组件区域 */}
      <div style={treeContainerStyle}>
        <div className={styles.antScrollbar} style={{ height: '100%', overflow: 'auto', maxHeight: '100%' }}>
          <Spin spinning={modelLoading} size="small">
            <Tree
              tree={treeData}
              selected={activeModel ? { path: (() => {
                // 查找当前选中项的分组
                const group = filteredModelList.find(g => (g.children || []).some(c => c.name === activeModel.name));
                if (group) return ((group as any).key || group.name) + '/' + activeModel.name;
                return activeModel.name;
              })() } : { path: '' }}
              onClickItem={(item: any) => {
                setActiveModel(item.data || item);
                if (item.data) onSelect(activeDs, item.data);
              }}
              renderMore={(item: any) => {
                if (item.type !== 'file') return null;
                return (
                  <Dropdown overlay={
                    <Menu>
                      <Menu.Item key="delete" onClick={() => setDeleteDialogVisible(true)}>删除</Menu.Item>
                    </Menu>
                  } trigger={["click"]}>
                    <MoreOutlined onClick={e => e.stopPropagation()}
                    />
                  </Dropdown>
                );
              }}
              renderIcon={(item: any, nodeType: any) => {
                if (nodeType === 'file') {
                  if (item.modelType === 'ENTITY') return <IconModel key={`model${item.path}`} />;
                  if (item.modelType === 'ENUM') return <IconEnum key={`enum${item.path}`} />;
                  return <IconFile key={`file${item.path}`} />;
                }
                // 文件夹分组特殊icon
                if (item.path === '__entity_group') return <IconEntityFolder key={`entityfolder${item.path}`} />;
                if (item.path === '__enum_group') return <IconEnumFolder key={`enumfolder${item.path}`} />;
                return <IconFolder key={`folder${item.path}`} />;
              }}
              compact={true}
            />
          </Spin>
        </div>
      </div>

      <Modal
        title={`${t("delete")} '${activeModel?.name}'?`}
        open={deleteDialogVisible}
        onCancel={() => setDeleteDialogVisible(false)}
        onOk={handleDelete}
      >
        {t("delete_dialog_text", { name: activeModel?.name })}
      </Modal>
      <CreateEntity
        visible={createDrawerVisible}
        datasource={activeDs}
        onConfirm={addEntity}
        onCancel={() => setCreateDrawerVisible(false)}
      />
      <CreateNativeQueryModel
        visible={createNativeQueryModelDrawerVisible}
        datasource={activeDs}
        onConfirm={() => {
          setCreateNativeQueryModelDrawerVisible(false);
          reqModelList();
        }}
        onCancel={() => setCreateNativeQueryModelDrawerVisible(false)}
      />
      <CreateEnum
        visible={createEnumDrawerVisible}
        datasource={activeDs}
        onConfirm={() => {
          setCreateEnumDrawerVisible(false);
          reqModelList();
        }}
        onCancel={() => setCreateEnumDrawerVisible(false)}
      />
    </div>
  );
};

export default ModelBrowser;

