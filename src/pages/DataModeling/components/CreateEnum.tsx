import type {Enum} from "@/types/data-modeling";
import {Drawer} from "antd";
import {createModel} from "../../../services/model.ts";
import {useTranslation} from "react-i18next";
import EnumView from "./EnumView.tsx";

interface Props {
  datasource: string;
  onConfirm: (model: Enum) => void;
  onCancel: () => void;
  visible: boolean;
}

const CreateEnum = ({datasource, onConfirm, onCancel, visible}: Props) => {
  const {t} = useTranslation();
  const onSubmit = async (data: Enum) => {
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
        <EnumView datasource={datasource} onConfirm={onSubmit}/>
      </Drawer>
    </>);
}

export default CreateEnum;
