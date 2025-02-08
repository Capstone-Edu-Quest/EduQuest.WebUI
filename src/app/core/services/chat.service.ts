import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IChatConversation } from '../../shared/interfaces/others.interfaces';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  // Firebase structure
  // /conversations
  //    /conv-001
  //       id: conv-001
  //       participants:
  //          user-123: lastSeen
  //          user-456: lastSeen
  //       createdAt: 2025-02-02T08:00:00Z
  //       lastMessage:
  //          senderId: user-456
  //          time: 2025-02-02T08:09:15Z
  //          content: Need help? I ran into something similar last week.
  //    /conv-002
  //       id: conv-001
  //       participants:
  //          user-123: lastSeen
  //          user-456: lastSeen
  //       createdAt: 2025-02-02T08:00:00Z
  //       lastMessage:
  //          senderId: user-456
  //          time: 2025-02-02T08:09:15Z
  //          content: Need help? I ran into something similar last week.
  // /messages
  //   /conv-001
  //     /msg-001
  //       id: msg-001
  //       senderId: user-123
  //       time: 2025-02-02T08:05:00Z
  //       content: Hey, how are you?
  //     /msg-002
  //       id: msg-002
  //       senderId: user-123
  //       time: 2025-02-02T08:05:00Z
  //       content: Hey, how are you?

  demoConversations: IChatConversation[] = [
    {
      id: 'conv-001',
      participants: {
        'user-123': {
          id: 'user-123',
          name: 'Alice',
          avatar: 'https://example.com/avatars/alice.png',
          lastSeen: '2025-02-02T08:10:00Z',
        },
        'user-456': {
          id: 'user-456',
          name: 'Bob',
          avatar: 'https://example.com/avatars/bob.png',
          lastSeen: '2025-02-02T08:09:00Z',
        },
      },
      createdAt: '2025-02-02T08:00:00Z',
      messages: [
        {
          id: 'msg-001',
          senderId: 'user-123',
          time: '2025-02-02T08:05:00Z',
          content: 'Hey, how are you?',
        },
        {
          id: 'msg-002',
          senderId: 'user-456',
          time: '2025-02-02T08:06:30Z',
          content: "I'm good! Just working on a project. You?",
        },
        {
          id: 'msg-003',
          senderId: 'user-123',
          time: '2025-02-02T08:07:45Z',
          content: 'Same here. Trying to debug an issue in Angular.',
        },
        {
          id: 'msg-004',
          senderId: 'user-456',
          time: '2025-02-02T08:09:15Z',
          content: 'Need help? I ran into something similar last week.',
        },
      ],
    },
    {
      id: 'conv-002',
      participants: {
        'user-789': {
          id: 'user-789',
          name: 'Charlie',
          avatar: 'https://example.com/avatars/charlie.png',
          lastSeen: '2025-02-02T09:10:00Z',
        },
        'user-456': {
          id: 'user-456',
          name: 'Bob',
          avatar: 'https://example.com/avatars/bob.png',
          lastSeen: '2025-02-02T09:12:00Z',
        },
      },
      createdAt: '2025-02-02T09:00:00Z',
      messages: [
        {
          id: 'msg-005',
          senderId: 'user-789',
          time: '2025-02-02T09:10:00Z',
          content: 'Hey, did you check out the new Firebase update?',
        },
        {
          id: 'msg-006',
          senderId: 'user-456',
          time: '2025-02-02T09:12:30Z',
          content: 'Not yet, what’s new in it?',
        },
        {
          id: 'msg-007',
          senderId: 'user-789',
          time: '2025-02-02T09:15:45Z',
          content:
            'It has better performance for real-time DB and new security features.',
        },
      ],
    },
  ];

  conversations$: BehaviorSubject<IChatConversation[]> = new BehaviorSubject<
    IChatConversation[]
  >([]);

  constructor() {}

  initChat() {
    this.conversations$.next(this.demoConversations);
  }

  destroyChat() {
    this.conversations$.next([]);
  }
}
