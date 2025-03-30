import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { Subscription } from 'rxjs';
import { IChatConversation } from '../../../shared/interfaces/others.interfaces';
import { NavigationEnd, Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.scss'],
})
export class ConversationsListComponent implements OnInit, OnDestroy {
  searchConversation: string = '';
  subscription$: Subscription = new Subscription();

  conversations: IChatConversation[] = [];
  currentViewId: string = '';

  constructor(
    private chat: ChatService,
    private router: Router,
    private user: UserService
  ) {}

  ngOnInit() {
    this.listenToChat();
    this.listenToConversationChange();
  }

  listenToChat() {
    this.subscription$.add(
      this.chat.conversations$.subscribe((conversations) => {
        this.conversations = conversations;
      })
    );
  }

  listenToConversationChange() {
    this.onCastUrlToId(this.router.url);
    this.subscription$.add(
      this.router.events.subscribe((e) => {
        if (e instanceof NavigationEnd) {
          this.onCastUrlToId(e.url);
        }
      })
    );
  }

  onCastUrlToId(url: string) {
    const data = url.split('/');
    this.currentViewId = data[data.length - 1];
  }

  viewChatMessage(conversationId: string) {
    this.router.navigate(['chat', conversationId]);
  }

  getOtherUser(conversation: IChatConversation) {
    const otherUser = Object.keys(conversation.participants).find(
      (key) => key !== this.user.user$.value?.id
    );
    return conversation.participants[otherUser as string].name ?? 'Unknown';
  }

  isMeSendMessage(conversation: IChatConversation) {
    return conversation.lastMessage?.senderId === this.user.user$.value?.id;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
