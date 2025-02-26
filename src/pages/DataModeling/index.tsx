import React, {useState} from "react";
import {Card, Divider, notification, Row, Splitter} from "antd";
import SelectModel from "./components/SelectModel.tsx";
import styles from "./index.module.scss";
import EntityView from "./components/EntityView.tsx";
import NativeQueryView from "./components/NativeQueryView.tsx";
import ModelGroupView from "./components/ModelGroupView.tsx";
import {modifyModel} from "../../api/model.ts";
import {useTranslation} from "react-i18next";
import EnumView from "./components/EnumView.tsx";
import {Enum} from "./data";

const ModelingPage: React.FC = () => {
  const {t} = useTranslation();

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
    console.log('active:',activeModel);
    switch (true) {
      case activeModel?.type === "entity":
        return <EntityView datasource={activeDs} model={activeModel}/>;
      case activeModel?.type === "enum":
        return <EnumView datasource={activeDs} model={activeModel} onConfirm={async (anEnum: Enum) => {
          try {
            await modifyModel(activeDs, anEnum);
            notification.success({message: t("form_save_success")});
            setSelectModelVersion(selectModelVersion + 1)
          } catch (error) {
            console.error(error);
            notification.error({message: t("form_save_failed")});
          }
        }}/>;
      case activeModel?.type === "native_query":
        return <NativeQueryView
          datasource={activeDs}
          model={activeModel}
          onConfirm={async data => {
            try {
              await modifyModel(activeDs, data);
              notification.success({message: t("form_save_success")});
              setSelectModelVersion(selectModelVersion + 1)
            } catch (error) {
              console.error(error);
              notification.error({message: t("form_save_failed")});
            }
          }}
        />;
      case activeModel?.type?.endsWith("_group"):
        return <ModelGroupView datasource={activeDs} model={activeModel}/>;
      default:
        return <div style={{padding: "20px", color: "gray"}}>Please select a model to operate.</div>;
    }
  };

  return (
    <Card className={`${styles.root} h-full`}>
      <Row className="flex-1">
        <Splitter>
          <Splitter.Panel defaultSize="20%" max="40%" collapsible>
            <div className={styles.panelContainer}>
              <SelectModel datasource={activeDs} editable onSelect={handleItemChange} version={selectModelVersion}/>
              <Divider/>
            </div>
          </Splitter.Panel>
          <Splitter.Panel>
            <div style={{padding: "20px"}}>
              {renderModelView()}
            </div>
          </Splitter.Panel>
        </Splitter>
      </Row>
    </Card>
  );
};

export default ModelingPage;
