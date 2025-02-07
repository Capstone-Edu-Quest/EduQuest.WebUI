import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import { IChatConversation } from '../../../shared/interfaces/others.interfaces';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';

@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ConversationMessageComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();
  currentConversationId: string = '';
  currentConversation!: IChatConversation | undefined;
  currentUserId: string = 'user-123'

  constructor(private route: ActivatedRoute, private chat: ChatService) {}

  ngOnInit() {
    this.listenToRoute();
    this.listenToChat();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.params.subscribe((params) => {
        this.currentConversationId = params['conversationId'];
        this.currentConversation = this.chat.conversations$.value.find(
          (c) => c.id === this.currentConversationId
        );
      })
    );
  }

  listenToChat() {
    this.subscription$.add(
      this.chat.conversations$.subscribe((con) => {
        this.currentConversation = con.find(
          (c) => c.id === this.currentConversationId
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
