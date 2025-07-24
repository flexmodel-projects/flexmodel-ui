import type {Field, Model} from '@/types/data-modeling';
import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Button, Checkbox, Divider, Drawer, Form, Input, message, Select, Splitter} from "antd";
import SelectModel from "../../DataModeling/components/SelectModel.tsx";
import {generateAPIs} from "../../../services/api-info.ts";

interface Props {
  onConfirm: (data: any) => void;
  onCancel: () => void;
  visible: boolean;
}

const BatchCreate: React.FC<Props> = ({visible, onConfirm, onCancel}) => {

  const {t} = useTranslation();
  const [form] = Form.useForm();
  const [datasource, setDatasource] = useState<any>();
  const [model, setModel] = useState<Model>();
  const [fieldOptions, setFieldOptions] = useState<any[]>();

  useEffect(() => {
    setFieldOptions(model?.fields?.map((f: Field) => ({value: f.name, label: f.name})));
    form.setFieldsValue({
      datasourceName: datasource,
      modelName: model?.name,
      apiFolder: model?.name,
      idFieldOfPath: model?.fields?.find((f: Field) => f.type === 'id')?.name,
      generateAPIs: ['list', 'view', 'create', 'update', 'delete', 'pagination']
    });
  }, [datasource, form, model]);

  return (
    <Drawer
      title={t('batch_new_api')}
      placement="right"
      onClose={onCancel}
      open={visible}
      width="80%"
      footer={
        <div style={{textAlign: 'right'}}>
          <Button onClick={onCancel} style={{marginRight: 8}}>
            {t('cancel')}
          </Button>
          <Button onClick={async () => {
            form.validateFields().then((values) => {
              generateAPIs(values).then(() => message.success(t('form_save_success')));
              onConfirm(values);
            });
          }} type="primary">
            {t('conform')}
          </Button>
        </div>
      }
    >
      <Splitter>
        <Splitter.Panel defaultSize="20%" max="40%" collapsible>
          <div style={{borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '10px 10px 0px 0px'}}>
            <SelectModel
              datasource={datasource}
              editable={false}
              onSelect={(ds: string, model: Model) => {
                setDatasource(ds);
                setModel(model);
              }}
            />
            <Divider/>
          </div>
        </Splitter.Panel>
        <Splitter.Panel>
          <div style={{borderRight: '1px solid rgba(5, 5, 5, 0.06)', padding: '10px 10px 10px 10px'}}>
            <Form form={form} layout="vertical">
              <Form.Item name="datasourceName" hidden>
                <Input/>
              </Form.Item>
              <Form.Item name="modelName" hidden>
                <Input/>
              </Form.Item>
              <Form.Item label={t('api_folder')} name="apiFolder" required>
                <Input/>
              </Form.Item>
              <Form.Item label={t('path_id_field')} name="idFieldOfPath" required>
                <Select options={fieldOptions}/>
              </Form.Item>
              <Form.Item label={t('generate_apis')} name="generateAPIs" required>
                <Checkbox.Group>
                  <Checkbox value="list" style={{lineHeight: '32px'}} defaultChecked>
                    List
                  </Checkbox>
                  <Checkbox value="view" style={{lineHeight: '32px'}} defaultChecked>
                    View
                  </Checkbox>
                  <Checkbox value="create" style={{lineHeight: '32px'}} defaultChecked>
                    Create
                  </Checkbox>
                  <Checkbox value="update" style={{lineHeight: '32px'}} defaultChecked>
                    Update
                  </Checkbox>
                  <Checkbox value="delete" style={{lineHeight: '32px'}} defaultChecked>
                    Delete
                  </Checkbox>
                  <Checkbox value="pagination" style={{lineHeight: '32px'}} defaultChecked>
                    Pagination
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </Form>
          </div>
        </Splitter.Panel>
      </Splitter>
    </Drawer>
  )
}
export default BatchCreate;
