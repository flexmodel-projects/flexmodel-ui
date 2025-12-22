import React, { useState, useEffect } from "react";
import { Modal, Typography } from "antd";
import { useTranslation } from "react-i18next";
import ScriptEditor from "./ScriptEditor";

type ScriptLanguage = "javascript" | "groovy" | "sql" | "json";

interface ScriptEditorModalProps {
    visible: boolean;
    value?: string;
    language?: ScriptLanguage;
    onChange?: (value: string) => void;
    onClose: () => void;
    title?: string;
    description?: string;
}

const ScriptEditorModal: React.FC<ScriptEditorModalProps> = ({
    visible,
    value,
    language = "javascript",
    onChange,
    onClose,
    title,
    description,
}) => {
    const { t } = useTranslation();
    const [tempValue, setTempValue] = useState<string>(value || "");

    useEffect(() => {
        if (!visible) {
            setTempValue(value || "");
        }
    }, [value, visible]);

    const modalTitle = title || t("apis.data_mapping.script_modal_title", {
        defaultValue: "脚本编辑器",
    });
    const modalDesc = description || t("apis.data_mapping.script_modal_desc", {
        defaultValue: "节点完成后可进行数据转换与处理，请输入脚本内容。",
    });
    const okText = t("common.confirm", { defaultValue: "确认" });
    const cancelText = t("common.cancel", { defaultValue: "取消" });

    const handleOk = () => {
        onChange?.(tempValue);
        onClose();
    };

    return (
        <Modal
            title={modalTitle}
            open={visible}
            width={800}
            onOk={handleOk}
            onCancel={onClose}
            destroyOnHidden
            okText={okText}
            cancelText={cancelText}
        >
            <Typography.Paragraph type="secondary">{modalDesc}</Typography.Paragraph>
            <ScriptEditor
                value={tempValue}
                onChange={(val) => setTempValue(val || "")}
                language={language}
                height={360}
            />
        </Modal>
    );
};

export default ScriptEditorModal;