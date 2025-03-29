import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { IChatConversation } from '../../../shared/interfaces/others.interfaces';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
@Component({
  selector: 'app-navbar-chat',
  templateUrl: './navbar-chat.component.html',
  styleUrls: ['./navbar-chat.component.scss'],
})
export class NavbarChatComponent implements OnInit, OnDestroy {
  conversations: IChatConversation[] = [];
  subscription$: Subscription = new Subscription();

  constructor(
    private chat: ChatService,
    private router: Router,
    private user: UserService
  ) {}

  ngOnInit() {
    this.listenToChat();
  }

  listenToChat() {
    this.subscription$.add(
      this.chat.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      })
    );
  }

  getOtherUser(conversation: IChatConversation) {
    const otherUser = Object.keys(conversation.participants).find(
      (key) => key !== this.user.user$.value?.id
    );
    return conversation.participants[otherUser as string].name ?? 'Unknown';
  }

  viewConversation(id: string) {
    this.router.navigate(['/chat', id]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
