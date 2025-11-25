import React, {useEffect, useMemo, useState} from "react";
import {Card, Divider, Space, Switch, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta, DataMappingConfig, DataMappingIOConfig,} from "@/types/api-management";
import '@/components/json-schema-editor/index.css';
import JsonSchemaEditor from '@/components/json-schema-editor';
import ScriptField from "./components/ScriptField";

type IOType = "input" | "output";

interface DataMappingProps {
    data: ApiMeta;
    onChange: (meta: ApiMeta) => void;
}

const getSchemaText = (schema?: Record<string, any>) => {
    if (!schema) return "";
    try {
        return JSON.stringify(schema, null, 2);
    } catch {
        return "";
    }
};

const normalizeIOConfig = (
    config?: DataMappingIOConfig
): DataMappingIOConfig | undefined => {
    if (!config) return undefined;
    const schema = config.schema;
    const script = config.script?.trim();

    const normalized: DataMappingIOConfig = {
        ...config,
        schema,
        script: script ?? undefined,
    };

    if (!normalized.schema) {
        delete normalized.schema;
    }
    if (!normalized.script) {
        delete normalized.script;
    }

    return Object.keys(normalized).length ? normalized : undefined;
};

const buildNextMeta = (
    data: ApiMeta,
    io: IOType,
    ioConfig: DataMappingIOConfig | undefined
): ApiMeta => {
    const currentMapping: DataMappingConfig = data?.dataMapping || {};
    const nextMapping: DataMappingConfig = {
        ...currentMapping,
        [io]: normalizeIOConfig(ioConfig),
    };

    if (!nextMapping.input && !nextMapping.output) {
        return {
            ...data,
            dataMapping: undefined,
        };
    }

    return {
        ...data,
        dataMapping: nextMapping,
    };
};

const DataMapping: React.FC<DataMappingProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
    const { Title } = Typography;
    const dataMapping = useMemo<DataMappingConfig>(
        () => data?.dataMapping || {},
        [data?.dataMapping]
    );
    const [inputSchemaText, setInputSchemaText] = useState<string>(() => getSchemaText(dataMapping.input?.schema));
    const [outputSchemaText, setOutputSchemaText] = useState<string>(() => getSchemaText(dataMapping.output?.schema));
    const [inputScript, setInputScript] = useState<string>(() => dataMapping.input?.script || "");
    const [outputScript, setOutputScript] = useState<string>(() => dataMapping.output?.script || "");
    const [inputScriptEnabled, setInputScriptEnabled] = useState<boolean>(() => dataMapping.input?.scriptEnabled ?? false);
    const [outputScriptEnabled, setOutputScriptEnabled] = useState<boolean>(() => dataMapping.output?.scriptEnabled ?? false);

    useEffect(() => {
        const nextInputSchema = getSchemaText(dataMapping.input?.schema);
        if (nextInputSchema !== inputSchemaText) {
            setInputSchemaText(nextInputSchema);
        }
        const nextOutputSchema = getSchemaText(dataMapping.output?.schema);
        if (nextOutputSchema !== outputSchemaText) {
            setOutputSchemaText(nextOutputSchema);
        }
        const nextInputScript = dataMapping.input?.script || "";
        if (nextInputScript !== inputScript) {
            setInputScript(nextInputScript);
        }
        const nextOutputScript = dataMapping.output?.script || "";
        if (nextOutputScript !== outputScript) {
            setOutputScript(nextOutputScript);
        }
        const nextInputScriptEnabled = dataMapping.input?.scriptEnabled ?? false;
        if (nextInputScriptEnabled !== inputScriptEnabled) {
            setInputScriptEnabled(nextInputScriptEnabled);
        }
        const nextOutputScriptEnabled = dataMapping.output?.scriptEnabled ?? false;
        if (nextOutputScriptEnabled !== outputScriptEnabled) {
            setOutputScriptEnabled(nextOutputScriptEnabled);
        }
    }, [
        dataMapping.input?.schema,
        dataMapping.input?.script,
        dataMapping.input?.scriptEnabled,
        dataMapping.output?.schema,
        dataMapping.output?.script,
        dataMapping.output?.scriptEnabled,
        inputSchemaText,
        inputScript,
        inputScriptEnabled,
        outputSchemaText,
        outputScript,
        outputScriptEnabled,
    ]);

    const handleSchemaChange = (value: string | undefined, io: IOType) => {
        const text = value ?? "";
        if (io === "input") {
            setInputSchemaText(text);
        } else {
            setOutputSchemaText(text);
        }

        if (!text.trim()) {
            const currentIO = io === "input" ? dataMapping.input : dataMapping.output;
            const nextIO: DataMappingIOConfig = {
                ...currentIO,
                schema: undefined,
                // ensure scriptEnabled is always boolean, not undefined
                scriptEnabled: currentIO?.scriptEnabled ?? false,
            };
            onChange(buildNextMeta(data, io, normalizeIOConfig(nextIO)));
            return;
        }

        try {
            const parsed = JSON.parse(text);
            const currentIO = io === "input" ? dataMapping.input : dataMapping.output;
            const nextIO: DataMappingIOConfig = {
                ...currentIO,
                schema: parsed,
                // ensure scriptEnabled is always boolean, not undefined
                scriptEnabled: currentIO?.scriptEnabled ?? false,
            };
            onChange(buildNextMeta(data, io, nextIO));
        } catch (error: any) {
            const message =
                error?.message || t("json_parse_error", { defaultValue: "JSON 解析失败" });
            console.error(message);
        }
    };

    const handleScriptChange = (value: string | undefined, io: IOType) => {
        const scriptValue = value ?? "";
        if (io === "input") {
            setInputScript(scriptValue);
        } else {
            setOutputScript(scriptValue);
        }
        const currentIO = io === "input" ? dataMapping.input : dataMapping.output;
        const nextIO: DataMappingIOConfig = {
            ...currentIO,
            script: scriptValue.trim() ? scriptValue : undefined,
            scriptEnabled: (io === "input" ? inputScriptEnabled : outputScriptEnabled),
        };
        onChange(buildNextMeta(data, io, nextIO));
    };

    const handleScriptToggle = (io: IOType, enabled: boolean) => {
        if (io === "input") {
            setInputScriptEnabled(enabled);
        } else {
            setOutputScriptEnabled(enabled);
        }
        const currentIO = io === "input" ? dataMapping.input : dataMapping.output;
        const nextIO: DataMappingIOConfig = {
            ...currentIO,
            scriptEnabled: enabled,
            script: enabled ? (io === "input" ? inputScript : outputScript) || currentIO?.script : undefined,
        };
        onChange(buildNextMeta(data, io, nextIO));
    };

    return (
        <Card
            className="h-full"
            style={{ height: "calc(100vh - 225px)", overflow: "auto" }}
        >

            <div>
                <Title level={4}>
                    {t("apis.data_mapping.input", { defaultValue: "入参设置" })}
                </Title>
                <Space direction="vertical" size="middle" className="w-full">
                    <JsonSchemaEditor
                        key="json-schema-editor-input"
                        lang="zh_CN"
                        data={inputSchemaText}
                        showEditor={false}
                        isMock={false}
                        onChange={(value: string) => handleSchemaChange(value, "input")}
                    />
                    <Space direction="horizontal" align="center">
                        <Typography.Text>
                            {t("apis.data_mapping.input_script_switch")}
                        </Typography.Text>
                        <Switch
                            checked={inputScriptEnabled}
                            onChange={(checked) => handleScriptToggle("input", checked)}
                        />
                    </Space>
                    {inputScriptEnabled && (
                        <ScriptField
                            label={t("apis.data_mapping.input_script", {
                                defaultValue: "执行脚本",
                            })}
                            value={inputScript}
                            onChange={(val) => handleScriptChange(val, "input")}
                        />
                    )}
                </Space>
            </div>

            <Divider />

            <div>
                <Title level={4}>
                    {t("apis.data_mapping.output", { defaultValue: "出参设置" })}
                </Title>
                <Space direction="vertical" size="middle" className="w-full">
                    <JsonSchemaEditor
                        key="json-schema-editor-output"
                        lang="zh_CN"
                        data={outputSchemaText}
                        showEditor={false}
                        isMock={false}
                        onChange={(value: string) => handleSchemaChange(value, "output")}
                    />
                    <Space direction="horizontal" align="center">
                        <Typography.Text>
                            {t("apis.data_mapping.output_script_switch")}
                        </Typography.Text>
                        <Switch
                            checked={outputScriptEnabled}
                            onChange={(checked) => handleScriptToggle("output", checked)}
                        />
                    </Space>
                    {outputScriptEnabled && (
                        <ScriptField
                            label={t("apis.data_mapping.output_script", {
                                defaultValue: "执行脚本",
                            })}
                            value={outputScript}
                            onChange={(val) => handleScriptChange(val, "output")}
                        />
                    )}
                </Space>
            </div>
        </Card>
    );
};

export default DataMapping;


