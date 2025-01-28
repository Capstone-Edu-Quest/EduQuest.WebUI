export interface IMessage {
  id: string;
  type: MessageType;
  message: string;
}

export type MessageType = 'success' | 'error' | 'warn'
