import React, {useEffect, useMemo, useState} from "react";
import {Card, Divider, Space, Typography} from "antd";
import {useTranslation} from "react-i18next";
import {ApiMeta, DataMappingConfig, DataMappingIOConfig,} from "@/types/api-management";
import '@/components/json-schema-editor/index.css';
import jeditor from '@/components/json-schema-editor';

const JEditor = jeditor({
  lang: 'zh_CN' // 或 'en_US'
});

const JEditor2 = jeditor({
    lang: 'zh_CN' // 或 'en_US'
  });

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
    const { Title, Text } = Typography;
    const [inputSchemaText, setInputSchemaText] = useState<string>("");
    const [outputSchemaText, setOutputSchemaText] = useState<string>("");
    const [inputScript, setInputScript] = useState<string>("");
    const [outputScript, setOutputScript] = useState<string>("");

    const dataMapping = useMemo<DataMappingConfig>(
        () => data?.dataMapping || {},
        [data?.dataMapping]
    );

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
    }, [
        dataMapping.input?.schema,
        dataMapping.input?.script,
        dataMapping.output?.schema,
        dataMapping.output?.script,
        inputSchemaText,
        inputScript,
        outputSchemaText,
        outputScript,
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
                    <JEditor
                        data={inputSchemaText}
                        showEditor={false}
                        isMock={false}
                        onChange={(value: string) => handleSchemaChange(value, "input")}
                    />
                    {/* <div>
                        <Text strong>
                            {t("apis.data_mapping.input_script", {
                                defaultValue: "脚本（JavaScript）",
                            })}
                        </Text>
                        <ScriptEditor
                            value={inputScript}
                            onChange={(val) => handleScriptChange(val, "input")}
                            language="javascript"
                            height={220}
                        />
                    </div> */}
                </Space>
            </div>

            <Divider />

            <div>
                <Title level={4}>
                    {t("apis.data_mapping.output", { defaultValue: "出参设置" })}
                </Title>
                <Space direction="vertical" size="middle" className="w-full">
                    <JEditor2
                        data={outputSchemaText}
                        showEditor={false}
                        isMock={false}
                        onChange={(value: string) => handleSchemaChange(value, "output")}
                    />
                    {/* <div>
                        <Text strong>
                            {t("apis.data_mapping.output_script", {
                                defaultValue: "脚本（JavaScript）",
                            })}
                        </Text>
                        <ScriptEditor
                            value={outputScript}
                            onChange={(val) => handleScriptChange(val, "output")}
                            language="javascript"
                            height={220}
                        />
                    </div> */}
                </Space>
            </div>
        </Card>
    );
};

export default DataMapping;


