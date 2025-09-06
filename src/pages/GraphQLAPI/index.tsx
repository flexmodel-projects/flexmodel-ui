import React, {useEffect, useState} from "react";
import {Button, message, Space} from "antd";
import {SettingOutlined} from "@ant-design/icons";
import GraphQL from "./components/GraphQL";
import {getSettings} from "@/services/settings";
import {Settings} from "@/types/settings";
import {useConfig} from "@/store/appStore";
import GraphQLSettingsModal from "./components/GraphQLSettingsModal";
import PageContainer from "@/components/common/PageContainer";
import {useTranslation} from "react-i18next";

const GraphQLAPI: React.FC = () => {
  const {config} = useConfig();
  const {t} = useTranslation();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);


  // 加载设置
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsData = await getSettings();
        setSettings(settingsData);
      } catch (error) {
        console.error(t('config_load_failed'), error);
        message.error(t('config_load_failed'));
      }
    };

    loadSettings();
  }, [t]);

  // 设置更新回调
  const handleSettingsUpdate = (updatedSettings: Settings) => {
    setSettings(updatedSettings);
    setSettingsModalVisible(false);
  };

  return (
    <PageContainer
      title={settings?.security.graphqlEndpointPath ? 
        `${t('graphql_endpoint')}: ${config?.apiRootPath || ''}${settings.security.graphqlEndpointPath}` : 
        t('graphql_api_title')
      }
      extra={
        <Space>
          <Button
            type="text"
            icon={<SettingOutlined/>}
            onClick={() => setSettingsModalVisible(true)}
            >
              {t('graphql_settings')}
            </Button>
        </Space>
      }
    >
      <GraphQL
        data={{
          query: `
# Welcome to GraphiQL
#
# GraphiQL is an in-browser tool for writing, validating, and testing
# GraphQL queries.
#
# Type queries into this side of the screen, and you will see intelligent
# typeaheads aware of the current GraphQL type schema and live syntax and
# validation errors highlighted within the text.
#
# GraphQL queries typically start with a "{" character. Lines that start
# with a # are ignored.
#
# An example GraphQL query might look like:
#
#     {
#       field(arg: "value") {
#         subField
#       }
#     }
#
# Keyboard shortcuts:
#
#   Prettify query:  Shift-Ctrl-P (or press the prettify button)
#
#  Merge fragments:  Shift-Ctrl-M (or press the merge button)
#
#        Run Query:  Ctrl-Enter (or press the play button)
#
#    Auto Complete:  Space (or just start typing)
#

`,
        }}
        onChange={(data) => {
          console.log('graphql onChange: ', data);
        }}
      />

      {/* 设置对话框 */}
      <GraphQLSettingsModal
        visible={settingsModalVisible}
        settings={settings}
        onCancel={() => setSettingsModalVisible(false)}
        onSuccess={handleSettingsUpdate}
      />
    </PageContainer>
  );
};

export default GraphQLAPI;
