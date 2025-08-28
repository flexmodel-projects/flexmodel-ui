import React, {useState} from 'react';
import {
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  PushpinFilled,
  PushpinOutlined,
  RobotOutlined
} from '@ant-design/icons';
import {Button, Divider, Dropdown, GetProp, Input, message, Space, theme} from 'antd';
import {ChatHeaderProps} from './types';
import {Conversations, ConversationsProps} from '@ant-design/x';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isFloating = false,
  onToggleFloating,
  onClose,
  showCloseButton = true
}) => {
  const { token } = theme.useToken();
  const [keyword, setKeyword] = useState('');

  const items: GetProp<ConversationsProps, 'items'> = [
    { key: 'conv-2024-09-12-1432', timestamp: 122243334343, label: '模型同步问题' },
    { key: 'conv-2024-09-11-2010', timestamp: 122243334343, label: 'GraphQL 字段命名规范讨论' },
    { key: 'conv-2024-09-10-0935', timestamp: 122243334343, label: '接口限流策略（每 60 秒 100 次）' },
    { key: 'conv-2024-09-09-2216', timestamp: 122243334343, label: '数据源连接失败排查（PostgreSQL）' },
    { key: 'conv-2024-09-08-1711', timestamp: 122243334343, label: 'AI 助手提示词优化（上下文长度' },
    { key: 'conv-2024-09-07-1124', timestamp: 122243334343, label: 'OpenAPI 转换 GraphQL 的映射规则' },
    { key: 'conv-2024-09-06-0842', timestamp: 122243334343, label: '前端错误上报与埋点方案' },
    { key: 'conv-2024-09-05-194q82', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-194w338', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-19s4348', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-19q4w348', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-194q8', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-19s48', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-1x948', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-19as48', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-1a948', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
    { key: 'conv-2024-09-05-19f48', timestamp: 122243334343, label: '模型字段类型变更影响评估' },
  ];


  const menuConfig: ConversationsProps['menu'] = (conversation) => ({
    items: [
      {
        label: '删除',
        key: 'delete',
        icon: <DeleteOutlined />,
        danger: true,
      },
    ],
    onClick: (menuInfo) => {
      menuInfo.domEvent.stopPropagation();
      message.info(`Click ${conversation.key} - ${menuInfo.key}`);
    },
  });

  return (
    <>
      <div style={{
        padding: `${token.paddingSM}px ${token.padding}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: token.colorBgElevated
      }}>
        <Space>
          <RobotOutlined style={{ color: token.colorPrimary }} />
          <span style={{
            fontWeight: token.fontWeightStrong,
            color: token.colorText
          }}>AI助手</span>
        </Space>
        <Space>
          <Button
            type="text"
            icon={<PlusSquareOutlined />}
            size="small"
            style={{ color: token.colorTextSecondary }}
            title="新聊天"
          />
          <Dropdown
            dropdownRender={() => (
              <div style={{
                backgroundColor: token.colorBgElevated,
                borderRadius: token.borderRadius,
                boxShadow: token.boxShadow,
                padding: token.paddingSM,
                maxHeight: 400
              }}>
                <div style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  background: token.colorBgElevated,
                  paddingBottom: token.paddingXS
                }}>
                  <Input
                    placeholder="搜索..."
                    allowClear
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div style={{ maxHeight: 340, overflow: 'auto' }}>
                  <Conversations menu={menuConfig} items={items} />
                </div>
              </div>
            )}
            trigger={['click']}>
            <Button
              type="text"
              icon={<ClockCircleOutlined />}
              size="small"
              style={{ color: token.colorTextSecondary }}
              title="聊天历史"
            />
          </Dropdown>
          <Divider type="vertical" />
          <Button
            type="text"
            icon={isFloating ? <PushpinFilled /> : <PushpinOutlined />}
            size="small"
            onClick={() => onToggleFloating?.(!isFloating)}
            style={{ color: token.colorTextSecondary }}
            title={isFloating ? "切换到固定模式" : "切换到悬浮模式"}
          />
          {showCloseButton && onClose && (
            <Button
              type="text"
              icon={<CloseOutlined />}
              size="small"
              onClick={onClose}
              style={{ color: token.colorTextSecondary }}
            />
          )}
        </Space>
      </div>
    </>
  );
};

export default ChatHeader;
