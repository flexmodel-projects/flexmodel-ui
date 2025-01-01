import React, { useState } from "react";
import { Card, Col, Divider, Row, Segmented, Splitter } from "antd";
import { useLocation } from "react-router-dom";
import SelectModel from "./components/SelectModel.tsx";
import FieldList from "./components/FieldList.tsx";
import IndexList from "./components/IndexList.tsx";
import RecordList from "./components/RecordList.tsx";
import { useTranslation } from "react-i18next";
import styles from "./index.module.scss";

const ModelingPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // 从URL中获取datasource参数
  const { datasource } = (location.state as { datasource: string }) || {};

  // 选项设置
  const options = [
    { label: t("field"), value: "field" },
    { label: t("index"), value: "index" },
    { label: t("record"), value: "record" },
  ];

  const [selectedItem, setSelectedItem] = useState<string>("field");
  const [activeDs, setActiveDs] = useState<string>(datasource || "");
  const [activeModel, setActiveModel] = useState<any>({});

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
  };

  return (
    <>
      <Card className={[styles.root, "h-full"].join(" ")}>
        <Row className="flex-1">
          <Col span={24}>
            <div>
              <Row>
                <Col span={12}>
                  <span style={{ fontWeight: 600, fontSize: "16px" }}>
                    {t("data_modeling")}
                  </span>
                </Col>
                <Col span={12} className="text-right">
                  <Segmented
                    value={selectedItem}
                    onChange={(val) => setSelectedItem(val as string)}
                    options={options}
                  />
                </Col>
              </Row>
            </div>
          </Col>
          <Splitter>
            <Splitter.Panel defaultSize="20%" max="40%" collapsible>
              <div
                style={{
                  borderRight: "1px solid rgba(5, 5, 5, 0.06)",
                  padding: "10px 10px 0px 0px",
                }}
              >
                <SelectModel
                  datasource={activeDs}
                  editable
                  onChange={handleItemChange}
                />
                <Divider />
              </div>
            </Splitter.Panel>
            <Splitter.Panel>
              {selectedItem === "field" && (
                <FieldList
                  datasource={activeDs}
                  model={activeModel}
                  /* onFieldsChange={(fields) => setActiveModel((prev) => ({ ...prev, fields }))}*/
                />
              )}
              {selectedItem === "index" && (
                <IndexList
                  datasource={activeDs}
                  model={activeModel}
                  /*onIndexesChange={(indexes) => setActiveModel((prev) => ({ ...prev, indexes }))}*/
                />
              )}
              {selectedItem === "record" && (
                <RecordList datasource={activeDs} model={activeModel} />
              )}
            </Splitter.Panel>
          </Splitter>
        </Row>
      </Card>
    </>
  );
};

export default ModelingPage;
