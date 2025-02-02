export interface IMessage {
  id: string;
  type: MessageType;
  message: string;
}

export type MessageType = 'success' | 'error' | 'warn';

export interface INotification {
  id: string;
  receiverId: string;
  url: string;
  time: string;
  content: string; // MESSAGE CODE
  value?: any[];
  isRead: boolean;
}

export interface IChatMessage {
  id: string;
  senderId: string;
  time: string;
  content: string;
}

export interface IChatConversation {
  id: string;
  participants: {
    [userId: string]: {
      id: string;
      name: string;
      avatar: string;
      lastSeen: string;
    };
  };
  createdAt: string;
  messages: IChatMessage[];
}
