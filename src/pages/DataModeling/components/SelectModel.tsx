import React, {useEffect, useMemo, useState} from "react";
import {Button, Dropdown, Input, Menu, Modal, Select, Spin, theme} from "antd";
import {EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {getDatasourceList} from "@/services/datasource.ts";
import {createModel as reqCreateModel, dropModel, getModelList,} from "@/services/model.ts";
import {useNavigate} from "react-router-dom";
import CreateEntity from "@/pages/DataModeling/components/CreateEntity.tsx";
import type {DatasourceSchema} from '@/types/data-source';
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {RootState} from "@/store/configStore.ts";
import CreateNativeQueryModel from "@/pages/DataModeling/components/CreateNativeQueryModel.tsx";
import CreateEnum from "@/pages/DataModeling/components/CreateEnum.tsx";
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

interface SelectModelProps {
  datasource?: string;
  editable: boolean;
  onSelect: (ds: string, model: Model) => void;
  version?: number;
}

const SelectModel: React.FC<SelectModelProps> = ({
  datasource,
  editable,
  onSelect,
  version,
}) => {
  const { t } = useTranslation();
  const { token } = theme.useToken();
  const { locale } = useSelector((state: RootState) => state.locale);
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
  const addEntity = async (item: any) => {
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

    // 自定义排序：先 ENTITY，再 ENUM，最后 NATIVE_QUERY
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
        modelType: item.data?.type, // 新增字段，标记模型类型 ENTITY/ENUM/NATIVE_QUERY
      })),
    }));
  }

  const treeData = useMemo(() => ({ children: convertToTreeData(filteredModelList) }), [filteredModelList]);


  const selectRowStyle = {
    display: 'flex',
    gap: token.marginXS,
    alignItems: 'center',
    marginBottom: token.marginXS,
  };

  const searchRowStyle = {
    display: 'flex',
    gap: token.marginXS,
    alignItems: 'center',
    width: '100%',
  };

  const treeContainerStyle = {
    flex: 1,
    minHeight: 0,
    overflow: 'hidden',
    backgroundColor: token.colorBgContainer,
    borderRadius: token.borderRadius,
    padding: token.paddingXS,
  };

  const selectStyle = {
    width: "100%",
    height: token.controlHeightSM,
    fontSize: token.fontSizeSM,
  };

  const inputStyle = {
    width: '100%',
    height: token.controlHeightSM,
    fontSize: token.fontSizeSM,
  };

  return (
    <>
      <div style={selectRowStyle}>
        <Select
          value={activeDs}
          onChange={onSelectDatasource}
          style={selectStyle}
          size="small"
        >
          {dsList.map((item) => (
            <Select.Option key={item.name} value={item.name}>
              <div style={{
                display: "flex",
                alignItems: "center",
                fontSize: token.fontSizeSM
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
                height: token.controlHeightSM,
                padding: 0,
                fontSize: token.fontSizeSM
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
          size="small"
          prefix={
            <SearchOutlined
              style={{
                color: token.colorTextSecondary,
                fontSize: token.fontSizeSM
              }}
            />
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
              size="small"
            />
          </Dropdown>
        )}
      </div>

      {/* 树形组件区域 */}
      <div style={treeContainerStyle}>
        <div className={styles.antScrollbar}>
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
                    <MoreOutlined
                      style={{
                        cursor: "pointer",
                        marginRight: token.marginXS,
                        fontSize: token.fontSizeSM
                      }}
                      onClick={e => e.stopPropagation()}
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
        onConfirm={async () => {
          setCreateNativeQueryModelDrawerVisible(false);
          await reqModelList();
        }}
        onCancel={() => setCreateNativeQueryModelDrawerVisible(false)}
      />
      <CreateEnum
        visible={createEnumDrawerVisible}
        datasource={activeDs}
        onConfirm={async () => {
          setCreateEnumDrawerVisible(false);
          await reqModelList();
        }}
        onCancel={() => setCreateEnumDrawerVisible(false)}
      />
    </>
  );
};

export default SelectModel;
