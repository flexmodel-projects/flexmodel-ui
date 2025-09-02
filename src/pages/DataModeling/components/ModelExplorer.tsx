import React, {useEffect, useMemo, useState} from "react";
import {Button, Dropdown, Input, Menu, Modal, Select, Spin} from "antd";
import {EditOutlined, MoreOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import {getDatasourceList} from "@/services/datasource.ts";
import {dropModel, getModelList,} from "@/services/model.ts";
import {useNavigate} from "react-router-dom";
import ModelCreationDialog from "@/pages/DataModeling/components/ModelForm";
import IDLModelForm from "@/pages/DataModeling/components/IDLModelForm";
import type {DatasourceSchema} from '@/types/data-source';
import {useTranslation} from "react-i18next";
import {useLocale} from "@/store/appStore.ts";
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

// 本地查询文件夹图标组件
const IconNativeQueryFolder = () => (
  <svg
    aria-hidden='true'
    focusable='false'
    data-icon='native-query-folder'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    className='icon-native-query-folder'
    width='18' height='18'
  >
    {/* 文件夹主体 - 黄色系 */}
    <rect x='2' y='7' width='20' height='11' rx='2.5' fill='#FAAD14' />
    {/* 文件夹盖子 */}
    <rect x='2' y='5' width='10' height='4' rx='1.5' fill='#FFE58F' />
    {/* 叠加一个Q字母 */}
    <text x='12' y='16' textAnchor='middle' fontSize='9' fill='#fff' fontFamily='Arial' fontWeight='bold'>NQ</text>
  </svg>
);

// 本地查询模型图标组件
const IconNativeQueryModel = () => (
  <svg
    aria-hidden='true'
    focusable='false'
    data-icon='native-query-model'
    role='img'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    className='icon-native-query-model'
    width='18' height='18'
  >
    {/* 紫色圆形背景，与枚举风格一致 */}
    <circle cx='12' cy='12' r='9' fill='#722ED1' />
    {/* 白色字母Q */}
    <text x='12' y='16' textAnchor='middle' fontSize='10' fill='#fff' fontFamily='Arial' fontWeight='bold'>Q</text>
  </svg>
);

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

const ModelExplorer: React.FC<ModelBrowserProps> = ({
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
  const [createModelDrawerVisible, setCreateModelDrawerVisible] = useState(false);
  const [createIDLModelVisible, setCreateIDLModelVisible] = useState(false);
  const [filterText, setFilterText] = useState<string>(""); // 监听搜索框输入
  // 添加模型
  const addModel = async () => {
    setCreateModelDrawerVisible(false);
    setCreateIDLModelVisible(false);
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
          case "entity":
            acc[type] = {
              type: "__entity_group",
              key: "__entity_group",
              name: t("entities"),
              children: [],
              isLeaf: false,
            };
            break;
          case "enum":
            acc[type] = {
              type: "__enum_group",
              key: "__enum_group",
              name: t("enums"),
              children: [],
              isLeaf: false,
            };
            break;
          case "native_query":
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

    // 自定义排序：先entity，再enum，最后native_query
    const order = ["entity", "enum", "native_query"];
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
        modelType: item.data?.type, // 新增字段，标记模型类型entity/enum/native_query
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
              onClick={() => navigate("/data/source")}
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
                <Menu.Item onClick={() => setCreateModelDrawerVisible(true)}>
                  {t("create_model")}
                </Menu.Item>
                <Menu.Item onClick={() => setCreateIDLModelVisible(true)}>
                  {t("create_model_by_idl")}
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
        <div style={{ height: '100%', overflow: 'auto', maxHeight: '100%' }}>
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
                  if (item.modelType === 'entity') return <IconModel key={`model${item.path}`} />;
                  if (item.modelType === 'enum') return <IconEnum key={`enum${item.path}`} />;
                  if (item.modelType === 'native_query') return <IconNativeQueryModel key={`query${item.path}`} />;
                  return <IconFile key={`file${item.path}`} />;
                }
                // 文件夹分组特殊icon
                if (item.path === '__entity_group') return <IconEntityFolder key={`entityfolder${item.path}`} />;
                if (item.path === '__enum_group') return <IconEnumFolder key={`enumfolder${item.path}`} />;
                if (item.path === '__native_query_group') return <IconNativeQueryFolder key={`queryfolder${item.path}`} />;
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
      <ModelCreationDialog
        visible={createModelDrawerVisible}
        datasource={activeDs}
        onConfirm={addModel}
        onCancel={() => setCreateModelDrawerVisible(false)}
      />
      <IDLModelForm
        visible={createIDLModelVisible}
        datasource={activeDs}
        onConfirm={addModel}
        onCancel={() => setCreateIDLModelVisible(false)}
      />
    </div>
  );
};

export default ModelExplorer;

