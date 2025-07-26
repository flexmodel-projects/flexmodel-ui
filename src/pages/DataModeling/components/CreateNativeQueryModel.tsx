import type {NativeQueryModel} from "@/types/data-modeling";
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
        className="bg-white dark:bg-[#23232a] dark:text-[#f5f5f5] transition-colors duration-300"
      >
        <NativeQueryView datasource={datasource} onConfirm={onSubmit}/>
      </Drawer>
    </>);
}

export default CreateNativeQueryModel;
