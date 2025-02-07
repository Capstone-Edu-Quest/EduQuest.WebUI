import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMessage, MessageType } from '../../shared/interfaces/others.interfaces';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private messagesSubject = new BehaviorSubject<IMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  addMessage(type: MessageType, message: string) {
    const currentMessages = this.messagesSubject.value;
    const newMessege = {
      id: String(new Date().getTime() * Math.random()),
      type,
      message,
    };
    this.messagesSubject.next([...currentMessages, newMessege]);

    // Remove the message after 3 seconds
    setTimeout(() => {
      this.removeMessage(newMessege.id);
    }, 3000);
  }

  removeMessage(id: string) {
    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next(currentMessages.filter((msg) => msg.id !== id));
  }
}
