import React, {useState} from "react";
import {Card, Divider, Row, Splitter} from "antd";
import {useLocation} from "react-router-dom";
import SelectModel from "./components/SelectModel.tsx";
import styles from "./index.module.scss";
import EntityView from "./components/EntityView.tsx";
import NativeQueryView from "./components/NativeQueryView.tsx";
import ModelGroupView from "./components/ModelGroupView.tsx";

const ModelingPage: React.FC = () => {
  const location = useLocation();

  // 从 URL 中获取 datasource 参数
  const {datasource} = (location.state as { datasource?: string }) || {};
  const [activeDs, setActiveDs] = useState(datasource || "");
  const [activeModel, setActiveModel] = useState<any>({});
  const [selectModelVersion, setSelectModelVersion] = useState(0);

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
  };

  // 渲染模型视图
  const renderModelView = () => {
    switch (true) {
      case activeModel?.type === "entity":
        return <EntityView datasource={activeDs} model={activeModel}/>;
      case activeModel?.type === "native_query":
        return <NativeQueryView
          datasource={activeDs}
          model={{name: activeModel.name, statement: activeModel.statement}}
          onConfirm={() => setSelectModelVersion(selectModelVersion + 1)}
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
              <SelectModel
                datasource={activeDs}
                editable
                onChange={handleItemChange}
                version={selectModelVersion}
              />
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
