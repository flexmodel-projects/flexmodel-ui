import {useCallback, useState} from "react";
import {message} from "antd";
import {XStream} from "@ant-design/x-sdk";
import {sendChatMessage} from "@/services/chat";
import {Message} from "./types";

export const useChat = (
  conversationId: string | null,
  initialMessages?: Message[],
  onMessages?: (messages: Message[]) => void,
) => {
  const [isLoading, setIsLoading] = useState(false);

  const scrollToBottom = useCallback(() => {
    const chatContainer = document.querySelector(".chat-messages-container");
    if (chatContainer) {
      requestAnimationFrame(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      });
    }
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || !initialMessages || !onMessages)
        return;

      const userMessage: Message = {
        id: Date.now().toString(),
        conversationId: conversationId,
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };

      // 更新消息列表，添加用户消息
      const updatedMessages = [...initialMessages, userMessage];
      onMessages(updatedMessages);
      setIsLoading(true);

      // 创建AI消息占位符
      const aiMessageId = (Date.now() + 1).toString();
      const aiMessage: Message = {
        id: aiMessageId,
        conversationId: conversationId,
        role: "assistant",
        content: "",
        timestamp: new Date(),
      };

      // 添加AI消息占位符
      onMessages([...updatedMessages, aiMessage]);

      try {
        // 准备请求数据
        const requestData: any = {
          conversationId: conversationId,
          messages: [
            ...initialMessages.map((msg) => ({
              role: msg.role,
              content: msg.content,
            })),
            {
              role: "user",
              content: content.trim(),
            },
          ],
          model: "gpt-3.5-turbo",
          stream: true,
        };

        // 使用chat服务发送流式请求
        const response = await sendChatMessage(requestData);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 使用 XStream 处理流式响应
        let accumulatedContent = "";
        for await (const line of XStream({
          readableStream: response.body as ReadableStream<Uint8Array>,
        })) {
          try {
            const { data } = line;
            if (data === "[DONE]") {
              return;
            }
            const parsedData = JSON.parse(data);
            if (parsedData.choices && parsedData.choices[0]?.delta?.content) {
              const content = parsedData.choices[0].delta.content;
              accumulatedContent += content;

              // 更新AI消息内容
              const currentMessages = [...updatedMessages, aiMessage];
              const updatedMessagesWithAI = currentMessages.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      content: accumulatedContent,
                      conversationId: parsedData.conversationId,
                    }
                  : {
                      ...msg,
                      conversationId: parsedData.conversationId,
                    },
              );
              onMessages(updatedMessagesWithAI);

              // 每次内容更新时滚动到底部
              scrollToBottom();
            }
          } catch (error) {
            console.error("解析流数据失败:", error);
          }
        }
      } catch (error) {
        console.error("API调用失败:", error);
        message.error("发送消息失败，请稍后重试");

        // 移除失败的AI消息
        const currentMessages = [...updatedMessages, aiMessage];
        const messagesWithoutFailedAI = currentMessages.filter(
          (msg) => msg.id !== aiMessageId,
        );
        onMessages(messagesWithoutFailedAI);
      } finally {
        setIsLoading(false);
      }
    },
    [conversationId, initialMessages, isLoading, scrollToBottom, onMessages],
  );

  return {
    messages: initialMessages || [],
    isLoading,
    handleSendMessage,
    scrollToBottom,
  };
};
