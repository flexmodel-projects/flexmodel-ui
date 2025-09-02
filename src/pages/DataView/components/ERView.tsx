import React, {useEffect, useState} from "react";
import {Card, Empty, notification, Select, Spin, Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import {getDatasourceList} from "@/services/datasource";
import {getModelList} from "@/services/model";
import ERDiagram from "@/pages/DataModeling/components/ERDiagramView";
import type {DatasourceSchema} from "@/types/data-source";
import type {Entity} from "@/types/data-modeling";
import {DatabaseOutlined, ReloadOutlined} from "@ant-design/icons";
import styles from "./ERView.module.scss";

const ERView: React.FC = () => {
  const { t } = useTranslation();
  const [datasources, setDatasources] = useState<DatasourceSchema[]>([]);
  const [selectedDatasource, setSelectedDatasource] = useState<string>("");
  const [models, setModels] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // 获取数据源列表
  useEffect(() => {
    const fetchDatasources = async () => {
      try {
        const dsList = await getDatasourceList();
        setDatasources(dsList);
        if (dsList.length > 0) {
          setSelectedDatasource(dsList[0].name);
        }
      } catch (error) {
        console.error("获取数据源列表失败:", error);
        notification.error({
          message: "获取数据源列表失败",
          description: "请检查网络连接或联系管理员"
        });
      }
    };
    fetchDatasources();
  }, []);

  // 监听全屏退出，刷新组件
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        // 退出全屏时，延迟刷新组件
        setTimeout(() => {
          setRefreshKey(prev => prev + 1);
        }, 100);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // 获取模型列表
  useEffect(() => {
    if (!selectedDatasource) return;

    const fetchModels = async () => {
      setLoading(true);
      try {
        const modelList = await getModelList(selectedDatasource);
        // 过滤出实体类型的模型
        const entityModels = modelList.filter(model => model.type === "entity") as Entity[];
        setModels(entityModels);
      } catch (error) {
        console.error("获取模型列表失败:", error);
        notification.error({
          message: "获取模型列表失败",
          description: "请检查数据源连接或联系管理员"
        });
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedDatasource]);

  const handleDatasourceChange = (value: string) => {
    setSelectedDatasource(value);
  };

  const handleRefresh = () => {
    if (selectedDatasource) {
      // 重新获取模型数据
      const fetchModels = async () => {
        setLoading(true);
        try {
          const modelList = await getModelList(selectedDatasource);
          const entityModels = modelList.filter(model => model.type === "entity") as Entity[];
          setModels(entityModels);
        } catch (error) {
          console.error("获取模型列表失败:", error);
          notification.error({
            message: "获取模型列表失败",
            description: "请检查数据源连接或联系管理员"
          });
          setModels([]);
        } finally {
          setLoading(false);
        }
      };
      fetchModels();
    }
  };

  return (
    <div className={styles.container}>
      <Card
        className={styles.contentCard}
        title={
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%'
          }}>
            {/* 左侧：标题区域 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <DatabaseOutlined style={{ fontSize: 16, color: '#1890ff' }} />
              <span style={{ fontSize: 14, fontWeight: 500 }}>{t("er_view")}</span>
            </div>

            {/* 右侧：操作区域 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Select
                value={selectedDatasource}
                onChange={handleDatasourceChange}
                style={{ minWidth: 150 }}
                placeholder={t("select_datasource")}
                loading={datasources.length === 0}
              >
                {datasources.map(ds => (
                  <Select.Option key={ds.name} value={ds.name}>
                    {ds.name}
                  </Select.Option>
                ))}
              </Select>

              <Tooltip title={t("refresh_models")}>
                <ReloadOutlined
                  onClick={handleRefresh}
                  style={{
                    cursor: 'pointer',
                    fontSize: 16,
                    color: '#666',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#1890ff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                />
              </Tooltip>
            </div>
          </div>
        }
        bodyStyle={{ padding: 0, height: '100%' }}
        style={{ height: '100%', margin: 0 }}
      >
        {loading ? (
          <div className={styles.loading}>
            <Spin size="large" />
            <p>{t("loading_models")}</p>
          </div>
        ) : models.length > 0 ? (
          <ERDiagram
            key={refreshKey}
            datasource={selectedDatasource}
            data={models}
          />
        ) : (
          <Empty
            description={t("no_model_data")}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </Card>
    </div>
  );
};

export default ERView;
