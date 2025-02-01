import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { INotification } from '../../shared/interfaces/OthersInterface';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  demoNotifications: INotification[] = [
    {
      id: '1',
      receiverId: 'user123',
      url: '/messages',
      time: '2025-02-01T14:30:00Z',
      content: 'You have a new message from Alice.',
      isRead: false,
    },
    {
      id: '2',
      receiverId: 'user123',
      url: '/orders/456',
      time: '2025-02-01T13:15:00Z',
      content: 'Your order #456 has been shipped!',
      isRead: true,
    },
    {
      id: '3',
      receiverId: 'user123',
      url: '/achievements',
      time: '2025-02-01T12:00:00Z',
      content: 'Congratulations! You earned the "Top Learner" badge.',
      isRead: false,
    },
    {
      id: '4',
      receiverId: 'user456',
      url: '/courses/789',
      time: '2025-02-01T10:45:00Z',
      content: 'A new course "Advanced TypeScript" is now available!',
      isRead: true,
    },
    {
      id: '5',
      receiverId: 'user123',
      url: '/profile',
      time: '2025-02-01T09:30:00Z',
      content: 'Your profile update was successful.',
      isRead: false,
    },
    {
      id: '6',
      receiverId: 'user456',
      url: '/notifications',
      time: '2025-02-01T08:20:00Z',
      content: 'You have 3 new friend requests.',
      isRead: false,
    },
  ];
  notification$: BehaviorSubject<INotification[]> = new BehaviorSubject<
    INotification[]
  >(this.demoNotifications);

  constructor() {}

  initNotifications() {

  }

  destroyNotification() {}
}
