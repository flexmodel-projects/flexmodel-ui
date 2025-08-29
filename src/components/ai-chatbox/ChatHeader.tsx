import React, {useCallback, useEffect, useState} from 'react';
import {
  ClockCircleOutlined,
  CloseOutlined,
  DeleteOutlined,
  PlusSquareOutlined,
  PushpinFilled,
  PushpinOutlined,
  RobotOutlined
} from '@ant-design/icons';
import {Button, Divider, Dropdown, Input, Menu, message, Space, Spin, theme} from 'antd';
import {ChatHeaderProps} from './types';
import {Conversation, deleteConversation, getConversations} from '@/services/chat';

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isFloating = false,
  onToggleFloating,
  onClose,
  onNewChat,
  showCloseButton = true,
  onSelectConversation
}) => {
  const { token } = theme.useToken();
  const [keyword, setKeyword] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 获取对话列表
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getConversations();
      setConversations(response);
    } catch (error) {
      console.error('获取对话列表失败:', error);
      message.error('获取对话列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除对话
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    try {
      await deleteConversation(conversationId);
      message.success('删除成功');
      // 重新获取对话列表
      fetchConversations();
    } catch (error) {
      console.error('删除对话失败:', error);
      message.error('删除对话失败');
    }
  }, [fetchConversations]);

  // 选择对话
  const handleSelectConversation = useCallback((conversationId: string) => {
    onSelectConversation?.(conversationId);
    setDropdownOpen(false);
    setKeyword('');
  }, [onSelectConversation]);

  // 搜索过滤对话
  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(keyword.toLowerCase())
  );

  // 当下拉框打开时获取对话列表
  useEffect(() => {
    if (dropdownOpen) {
      fetchConversations();
    }
  }, [dropdownOpen, fetchConversations]);

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
            onClick={onNewChat}
          />
          <Dropdown
            open={dropdownOpen}
            onOpenChange={setDropdownOpen}
            dropdownRender={() => (
              <div style={{
                backgroundColor: token.colorBgElevated,
                borderRadius: token.borderRadius,
                boxShadow: token.boxShadow,
                padding: token.paddingSM,
                maxHeight: 400,
                minWidth: 300
              }}>
                <div style={{
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  background: token.colorBgElevated,
                  paddingBottom: token.paddingXS
                }}>
                  <Input
                    placeholder="搜索对话..."
                    allowClear
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div style={{ maxHeight: 340, overflow: 'auto' }}>
                  {loading ? (
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      padding: token.paddingLG,
                      color: token.colorTextSecondary
                    }}>
                      <Spin size="small" />
                      <span style={{ marginLeft: token.marginXS }}>加载中...</span>
                    </div>
                  ) : filteredConversations.length > 0 ? (
                    <div>
                      {filteredConversations.map(conv => (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv.id)}
                          style={{
                            padding: token.paddingSM,
                            cursor: 'pointer',
                            borderBottom: `1px solid ${token.colorBorderSecondary}`,
                            transition: 'background-color 0.2s',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = token.colorBgLayout;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                          }}
                        >
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontWeight: 500,
                              color: token.colorText,
                              marginBottom: token.marginXS
                            }}>
                              {conv.title || '未命名对话'}
                            </div>
                            <div style={{
                              fontSize: token.fontSizeSM,
                              color: token.colorTextSecondary
                            }}>
                              {conv.createdAt ? new Date(conv.createdAt).toLocaleString() : ''}
                            </div>
                          </div>
                          <Dropdown
                            overlay={
                              <Menu
                                items={[
                                  {
                                    label: '删除',
                                    key: 'delete',
                                    icon: <DeleteOutlined />,
                                    danger: true,
                                    onClick: (e) => {
                                      e.domEvent.stopPropagation();
                                      handleDeleteConversation(conv.id);
                                    }
                                  }
                                ]}
                              />
                            }
                            trigger={['click']}
                          >
                            <Button
                              type="text"
                              size="small"
                              icon={<DeleteOutlined />}
                              style={{ color: token.colorTextSecondary }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </Dropdown>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: token.paddingLG,
                      color: token.colorTextSecondary
                    }}>
                      {keyword ? '没有找到匹配的对话' : '暂无对话记录'}
                    </div>
                  )}
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
