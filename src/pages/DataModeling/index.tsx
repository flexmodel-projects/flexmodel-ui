import React, {useState} from "react";
import {message, Splitter} from "antd";
import PageContainer from "@/components/common/PageContainer";
import ModelExplorer from "@/pages/DataModeling/components/ModelExplorer.tsx";
import EntityView from "@/pages/DataModeling/components/EntityView";
import NativeQueryView from "@/pages/DataModeling/components/NativeQueryView";
import {modifyModel} from "@/services/model.ts";
import {useTranslation} from "react-i18next";
import EnumView from "@/pages/DataModeling/components/EnumView";
import type {Enum} from "@/types/data-modeling.d.ts";
import ERDiagram from "@/pages/DataModeling/components/ERDiagramView";

const ModelingPage: React.FC = () => {
  const { t } = useTranslation();

  const [activeDs, setActiveDs] = useState("");
  const [activeModel, setActiveModel] = useState<any>({});
  const [selectModelVersion, setSelectModelVersion] = useState(0);

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
  };

  // 渲染模型视图
  const renderModelView = () => {
    console.log("active:", activeModel);
    switch (true) {
      case activeModel?.type === "entity":
        return <EntityView datasource={activeDs} model={activeModel} />;
      case activeModel?.type === "enum":
        return (
          <EnumView
            datasource={activeDs}
            model={activeModel}
            onConfirm={async (anEnum: Enum) => {
              try {
                await modifyModel(activeDs, anEnum);
                message.success(t("form_save_success"));
                setSelectModelVersion(selectModelVersion + 1);
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
            {renderModelView()}
          </div>
        </Splitter.Panel>
      </Splitter>
    </PageContainer>
  );
};

export default ModelingPage;
