import React, {useState} from "react";
import {Card, notification, Row, Splitter, theme} from "antd";
import SelectModel from "@/pages/DataModeling/components/SelectModel.tsx";
import styles from "@/pages/DataModeling/index.module.scss";
import EntityView from "@/pages/DataModeling/components/EntityView.tsx";
import NativeQueryView from "@/pages/DataModeling/components/NativeQueryView.tsx";
import {modifyModel} from "@/services/model.ts";
import {useTranslation} from "react-i18next";
import EnumView from "@/pages/DataModeling/components/EnumView.tsx";
import type {Enum} from '@/types/data-modeling.d.ts';
import ERDiagram from "@/pages/DataModeling/components/ERDiagramView.tsx";

const ModelingPage: React.FC = () => {
  const {t} = useTranslation();
  const { token } = theme.useToken();

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
      case activeModel?.type === "ENTITY":
        return <EntityView datasource={activeDs} model={activeModel}/>;
      case activeModel?.type === "ENUM":
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
      case activeModel?.type === "NATIVE_QUERY":
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
        // return <ModelGroupView datasource={activeDs} model={activeModel}/>;
        return <ERDiagram datasource={activeDs} data={activeModel?.children}/>;
      default:
        return <div style={{padding: token.padding, color: "gray"}}>Please select a model to operate.</div>;
    }
  };

  return (
    <Card 
      className={`${styles.root} h-full`}
      style={{
        borderRadius: token.borderRadius,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Row 
        className="flex-1" 
        style={{
          height: '100%',
          gap: token.marginXS
        }}
      >
        <Splitter>
          <Splitter.Panel 
            defaultSize="20%" 
            max="40%" 
            collapsible 
            style={{
              height: '100%', 
              paddingRight: token.marginXS, 
              boxSizing: 'border-box'
            }}
          >
            <div 
              className={styles.panelContainer} 
              style={{
                height: '100%', 
                overflow: 'hidden',
                borderRadius: token.borderRadius,
                padding: token.paddingSM
              }}
            >
              <SelectModel datasource={activeDs} editable onSelect={handleItemChange} version={selectModelVersion}/>
            </div>
          </Splitter.Panel>
          <Splitter.Panel 
            style={{
              height: '100%', 
              paddingLeft: token.marginXS, 
              boxSizing: 'border-box'
            }}
          >
            <div 
              className={styles.panelContainer}
              style={{
                borderRadius: token.borderRadius,
                padding: token.paddingSM,
                height: '100%',
                overflow: 'hidden'
              }}
            >
              {renderModelView()}
            </div>
          </Splitter.Panel>
        </Splitter>
      </Row>
    </Card>
  );
};

export default ModelingPage;
