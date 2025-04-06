import FieldList from "./FieldList.tsx";
import IndexList from "./IndexList.tsx";
import RecordList from "./RecordList.tsx";
import {useState} from "react";
import {Col, Row, Segmented} from "antd";
import {useTranslation} from "react-i18next";
import CodeView from "./CodeView.tsx";

interface Props {
  datasource: string;
  model: any;
}

const EntityView = ({model, datasource}: Props) => {
  const {t} = useTranslation();
  const [selectedItem, setSelectedItem] = useState<string>("field");
  // 选项设置
  const options = [
    {label: t("field"), value: "field"},
    {label: t("index"), value: "index"},
    {label: t("record"), value: "record"},
    {label: t("code"), value: "code"},
  ];

  return <div>
    <div>
      <Row>
        <Col span={12}>
                  <span style={{fontWeight: 600, fontSize: "16px"}}>
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
    {selectedItem === "field" && (
      <FieldList
        datasource={datasource}
        model={model}
      />
    )}
    {selectedItem === "index" && (
      <IndexList
        datasource={datasource}
        model={model}
      />
    )}
    {selectedItem === "record" && (
      <RecordList datasource={datasource} model={model}/>
    )}
    {selectedItem === "code" && (
      <CodeView datasource={datasource} model={model}/>
    )}
  </div>;
};

export default EntityView;
