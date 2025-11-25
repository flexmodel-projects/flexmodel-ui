import React, {useEffect, useMemo, useState} from "react";
import {Button, Input, Modal, Tooltip, Typography} from "antd";
import {CodeOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import ScriptEditor from "@/components/common/ScriptEditor";

type ScriptLanguage = "javascript" | "groovy" | "sql" | "json";

interface ScriptFieldProps {
    label?: string;
    value?: string;
    language?: ScriptLanguage;
    onChange?: (value: string) => void;
}

const ScriptField: React.FC<ScriptFieldProps> = ({
    label,
    value,
    language = "javascript",
    onChange,
}) => {
    const { t } = useTranslation();
    const [visible, setVisible] = useState(false);
    const [tempValue, setTempValue] = useState<string>(value || "");

    const placeholder = t("apis.data_mapping.script_placeholder", {
        defaultValue: "点击右侧按钮配置脚本",
    });
    const tooltip = t("apis.data_mapping.open_script_editor", {
        defaultValue: "打开脚本编辑器",
    });
    const modalTitle = t("apis.data_mapping.script_modal_title", {
        defaultValue: "脚本编辑器",
    });
    const modalDesc = t("apis.data_mapping.script_modal_desc", {
        defaultValue: "节点完成后可进行数据转换与处理，请输入脚本内容。",
    });
    const okText = t("common.confirm", { defaultValue: "确认" });
    const cancelText = t("common.cancel", { defaultValue: "取消" });

    useEffect(() => {
        if (!visible) {
            setTempValue(value || "");
        }
    }, [value, visible]);

    const previewText = useMemo(() => {
        if (!value) return "";
        return value.replace(/\s+/g, " ").slice(0, 80);
    }, [value]);

    const handleOpen = () => {
        setVisible(true);
    };

    const handleClose = () => {
        setVisible(false);
    };

    const handleOk = () => {
        onChange?.(tempValue);
        handleClose();
    };

    return (
        <div>
            {label && <Typography.Text strong>{label}</Typography.Text>}
            <Input
                readOnly
                size="small"
                value={previewText}
                placeholder={placeholder}
                onDoubleClick={handleOpen}
                suffix={
                    <Tooltip title={tooltip}>
                        <Button type="text" icon={<CodeOutlined />} onClick={handleOpen} />
                    </Tooltip>
                }
            />
            <Modal
                title={modalTitle}
                open={visible}
                width={800}
                onOk={handleOk}
                onCancel={handleClose}
                destroyOnClose
                okText={okText}
                cancelText={cancelText}
            >
                <Typography.Paragraph type="secondary">{modalDesc}</Typography.Paragraph>
                <ScriptEditor
                    value={tempValue}
                    onChange={(val) => setTempValue(val ?? "")}
                    language={language}
                    height={360}
                />
            </Modal>
        </div>
    );
};

export default ScriptField;


