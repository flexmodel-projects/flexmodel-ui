
// 聊天消息类型
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// 聊天请求参数
export interface ChatRequestParams {
  messages: ChatMessage[];
  model: string;
  stream: boolean;
}


/**
 * 发送聊天消息（流式响应）
 */
export const sendChatMessage = async (params: ChatRequestParams): Promise<Response> => {
  return fetch('/api/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
};
