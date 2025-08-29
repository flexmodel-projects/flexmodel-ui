export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface AIChatBoxProps {
  isVisible?: boolean;
  onToggle?: (visible: boolean) => void;
  style?: React.CSSProperties;
  isFloating?: boolean;
  onToggleFloating?: (floating: boolean) => void;
  messages?: Message[];
  onMessages?: (messages: Message[]) => void;
  onSelectConversation?: (conversationId: string) => void;
}

export interface ChatHeaderProps {
  isFloating?: boolean;
  onToggleFloating?: (floating: boolean) => void;
  onClose?: () => void;
  showCloseButton?: boolean;
  onSelectConversation?: (conversationId: string) => void;
}

export interface ChatContentProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export interface FloatingChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onToggleFloating: (floating: boolean) => void;
  onClose: () => void;
  onSelectConversation?: (conversationId: string) => void;
}

export interface FixedChatProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onToggleFloating: (floating: boolean) => void;
  onClose?: () => void;
  style?: React.CSSProperties;
  onSelectConversation?: (conversationId: string) => void;
}
