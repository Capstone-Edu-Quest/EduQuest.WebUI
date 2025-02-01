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
