import React, {useEffect, useState} from "react";
import {Empty, notification, Select, Spin} from "antd";
import {useTranslation} from "react-i18next";
import PageContainer from "@/components/common/PageContainer";
import {getDatasourceList} from "@/services/datasource";
import {getModelList} from "@/services/model";
import ERDiagram from "@/pages/DataModeling/components/ERDiagramView";
import type {DatasourceSchema} from "@/types/data-source";
import type {Entity} from "@/types/data-modeling";
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
        console.error(t("get_datasource_list_failed"), error);
        notification.error({
          message: t("get_datasource_list_failed"),
          description: t("get_datasource_list_failed_desc")
        });
      }
    };
    fetchDatasources();
  }, [t]);

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
        console.error(t("get_model_list_failed"), error);
        notification.error({
          message: t("get_model_list_failed"),
          description: t("get_model_list_failed_desc")
        });
        setModels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [selectedDatasource, t]);

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
          console.error(t("get_model_list_failed"), error);
          notification.error({
            message: t("get_model_list_failed"),
            description: t("get_model_list_failed_desc")
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
    <PageContainer
      title={t("er_view")}
      extra={
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
        </div>
      }
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
    </PageContainer>
  );
};

export default ERView;
