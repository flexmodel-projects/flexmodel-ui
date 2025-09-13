import React, {useRef, useState} from "react";
import {Button, message, Space, Splitter} from "antd";
import PageContainer from "@/components/common/PageContainer";
import ModelExplorer from "@/pages/DataModeling/components/ModelExplorer.tsx";
import EntityView from "@/pages/DataModeling/components/EntityView";
import NativeQueryView from "@/pages/DataModeling/components/NativeQueryView";
import {modifyModel} from "@/services/model.ts";
import {useTranslation} from "react-i18next";
import EnumForm from "@/pages/DataModeling/components/EnumForm";
import type {Enum} from "@/types/data-modeling.d.ts";
import ERDiagram from "@/pages/DataModeling/components/ERDiagramView";

const ModelingPage: React.FC = () => {
  const { t } = useTranslation();

  const [activeDs, setActiveDs] = useState("");
  const [activeModel, setActiveModel] = useState<any>({});
  const [selectModelVersion, setSelectModelVersion] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const enumFormRef = useRef<any>(null);

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
    setIsEditing(false); // 切换模型时重置编辑状态
  };

  // 切换编辑状态
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  // 保存数据
  const handleSave = () => {
    if (enumFormRef.current) {
      enumFormRef.current.submit();
    }
  };

  // 渲染模型视图
  const renderModelView = () => {
    console.log("active:", activeModel);
    switch (true) {
      case activeModel?.type === "entity":
        return <EntityView datasource={activeDs} model={activeModel} />;
      case activeModel?.type === "enum":
        return (
          <EnumForm
            ref={enumFormRef}
            mode={isEditing ? "edit" : "view"}
            datasource={activeDs}
            model={activeModel}
            onConfirm={async (anEnum: Enum) => {
              try {
                await modifyModel(activeDs, anEnum);
                message.success(t("form_save_success"));
                setSelectModelVersion(selectModelVersion + 1);
                setIsEditing(false); // 保存成功后退出编辑状态
              } catch (error) {
                console.error(error);
                message.error(t("form_save_failed"));
              }
            }}
          />
        );
      case activeModel?.type === "native_query":
        return (
          <NativeQueryView
            datasource={activeDs}
            model={activeModel}
            onConfirm={async (data) => {
              try {
                await modifyModel(activeDs, data);
                message.success(t("form_save_success"));
                setSelectModelVersion(selectModelVersion + 1);
              } catch (error) {
                console.error(error);
                message.error(t("form_save_failed"));
              }
            }}
          />
        );
      case activeModel?.type?.endsWith("_group"):
        return <ERDiagram data={activeModel?.children} />;
      default:
        return <div>Please select a model to operate.</div>;
    }
  };

  return (
    <PageContainer>
      <Splitter>
        <Splitter.Panel
          defaultSize="20%"
          max="40%"
          collapsible
        >
          <div className="pr-2">
            <ModelExplorer
              datasource={activeDs}
              editable
              onSelect={handleItemChange}
              version={selectModelVersion}
            />
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div className="pl-2">
            {/* 编辑控制按钮 */}
            {activeModel?.type === "enum" && (
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <Space>
                  {!isEditing ? (
                    <Button
                      type="primary"
                      onClick={handleToggleEdit}
                    >
                      {t('edit')}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleCancelEdit}
                      >
                        {t('cancel')}
                      </Button>
                      <Button
                        type="primary"
                        onClick={handleSave}
                      >
                        {t('save')}
                      </Button>
                    </>
                  )}
                </Space>
              </div>
            )}
            {renderModelView()}
          </div>
        </Splitter.Panel>
      </Splitter>
    </PageContainer>
  );
};

export default ModelingPage;
