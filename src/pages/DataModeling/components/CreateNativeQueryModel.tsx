import type {NativeQueryModel} from "../data";
import NativeQueryView from "./NativeQueryView.tsx";
import {Drawer} from "antd";
import {createModel} from "../../../services/model.ts";
import {useTranslation} from "react-i18next";

interface Props {
  datasource: string;
  onConfirm: (model: NativeQueryModel) => void;
  onCancel: () => void;
  visible: boolean;
}

const CreateNativeQueryModel = ({datasource, onConfirm, onCancel, visible}: Props) => {
  const {t} = useTranslation();
  const onSubmit = async (data: NativeQueryModel) => {
    await createModel(datasource, data);
    onConfirm(data);
  }
  return (
    <>
      <Drawer
        title={t('new_native_query')}
        width={"60%"}
        onClose={() => onCancel()}
        open={visible}
      >
        <NativeQueryView datasource={datasource} onConfirm={onSubmit}/>
      </Drawer>
    </>);
}

export default CreateNativeQueryModel;
