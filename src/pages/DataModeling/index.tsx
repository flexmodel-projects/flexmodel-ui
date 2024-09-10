import React, {useEffect, useRef, useState} from 'react';
import {Button, Card, Col, Divider, Drawer, Row, Segmented} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {useLocation, useNavigate} from 'react-router-dom';
import {createModel as reqCreateModel} from '../../api/model';
import SelectModel from "./components/SelectModel.tsx";
import FieldList from "./components/FieldList.tsx";
import IndexList from "./components/IndexList.tsx";
import RecordList from "./components/RecordList.tsx";
import CreateModel from "./components/CreateModel.tsx";
import {getRecordList} from "../../api/record.ts"; // 假设是API请求

const ModelingPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate(); // 替代 useHistory

  // 从URL中获取datasource参数
  const {datasource} = location.state as { datasource: string } || {};

  // 选项设置
  const options = [
    {label: 'Field', value: 'field'},
    {label: 'Index', value: 'index'},
    {label: 'Record', value: 'record'},
  ];

  const [selectedItem, setSelectedItem] = useState<string>('field');
  const [activeDs, setActiveDs] = useState<string>(datasource || '');
  const [activeModel, setActiveModel] = useState<any>({});
  const [drawerVisible, setDrawerVisible] = useState(false);

  const selectModelRef = useRef<any>(null);

  // 处理选择的模型变化
  const handleItemChange = (ds: string, item: any) => {
    setActiveDs(ds);
    setActiveModel(item);
  };

  // 添加模型
  const addModel = async (item: any) => {
    await reqCreateModel(activeDs, item);
    setDrawerVisible(false);
    if (selectModelRef.current) {
      selectModelRef.current.reload();
    }
  };

  // 模拟 Vue 的 onMounted 钩子
  useEffect(() => {
    if (activeDs) {
      navigate(`/modeling`, {state: {datasource: activeDs}});
    }
  }, [activeDs, navigate]);

  return (
    <Row>
      <Col span={24}>
        <Card bordered={false}>
          <Row>
            <Col span={12}>
              Data modeling
            </Col>
            <Col span={12} style={{textAlign: 'right'}}>
              <Segmented
                value={selectedItem}
                onChange={(val) => setSelectedItem(val as string)}
                options={options}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={4}>
        <Card bordered={false}>
          <SelectModel
            datasource={activeDs}
            editable
            onChange={handleItemChange}
          />
          <Divider/>
          <Button
            type="primary"
            icon={<PlusOutlined/>}
            onClick={() => setDrawerVisible(true)}
            block
            ghost
          >
            New model
          </Button>
        </Card>
      </Col>
      <Col span={20}>
        {selectedItem === 'field' && (
          <FieldList
            datasource={activeDs}
            model={activeModel}
            /* onFieldsChange={(fields) => setActiveModel((prev) => ({ ...prev, fields }))}*/
          />
        )}
        {selectedItem === 'index' && (
          <IndexList
            datasource={activeDs}
            model={activeModel}
            /*onIndexesChange={(indexes) => setActiveModel((prev) => ({ ...prev, indexes }))}*/
          />
        )}
        {selectedItem === 'record' && (
          <RecordList datasource={activeDs} model={activeModel}
                      getRecordList={(datasource: string, modelName: string, query: {
                        current: number;
                        pageSize: number
                      }) => getRecordList(datasource, modelName, query)}
          />
        )}
      </Col>

      <Drawer
        title="Create Model"
        width={500}
        visible={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{textAlign: 'right'}}>
            <Button onClick={() => setDrawerVisible(false)} style={{marginRight: 8}}>
              Cancel
            </Button>
            <Button onClick={() => addModel(activeModel)} type="primary">
              Conform
            </Button>
          </div>
        }
      >
        <CreateModel datasource={activeDs} onConform={addModel} onCancel={() => setDrawerVisible(false)}/>
      </Drawer>
    </Row>
  );
};

export default ModelingPage;
