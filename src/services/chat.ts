
// 聊天消息类型
export interface ChatMessage {
  role: string;
  content: string;
}

// 聊天请求参数
export interface ChatRequest {
  model?: string;
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

// 创建对话请求
export interface CreateConversationRequest {
  title?: string;
}

// 发送消息请求
export interface SendMessageRequest {
  content: string;
  model?: string;
}

// 对话信息
export interface Conversation {
  id: string;
  title?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API 响应基础类型
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  success?: boolean;
}

// 分页响应
export interface PagedResponse<T> {
  total: number;
  list: T[];
}


/**
 * 发送聊天消息（流式响应）
 */
export const sendChatMessage = async (params: ChatRequest): Promise<Response> => {
  return fetch('/api/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
};

/**
 * 获取对话列表
 */
export const getConversations = async (): Promise<PagedResponse<Conversation>> => {
  const response = await fetch('/api/chat/conversations', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取对话列表失败: ${response.status}`);
  }

  return response.json();
};

/**
 * 创建新对话
 */
export const createConversation = async (params: CreateConversationRequest): Promise<ApiResponse<Conversation>> => {
  const response = await fetch('/api/chat/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    throw new Error(`创建对话失败: ${response.status}`);
  }

  return response.json();
};

/**
 * 获取指定对话信息
 */
export const getConversation = async (id: string): Promise<ApiResponse<Conversation>> => {
  const response = await fetch(`/api/chat/conversations/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取对话失败: ${response.status}`);
  }

  return response.json();
};

/**
 * 删除指定对话
 */
export const deleteConversation = async (id: string): Promise<void> => {
  const response = await fetch(`/api/chat/conversations/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`删除对话失败: ${response.status}`);
  }
};

/**
 * 获取对话消息列表
 */
export const getConversationMessages = async (id: string): Promise<PagedResponse<ChatMessage>> => {
  const response = await fetch(`/api/chat/conversations/${id}/messages`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`获取消息列表失败: ${response.status}`);
  }

  return response.json();
};

/**
 * 向对话发送消息
 */
export const sendMessage = async (conversationId: string, params: SendMessageRequest): Promise<Response> => {
  return fetch(`/api/chat/conversations/${conversationId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params)
  });
};
