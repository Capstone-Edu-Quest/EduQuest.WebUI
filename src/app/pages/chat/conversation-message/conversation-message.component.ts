import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatService } from '../../../core/services/chat.service';
import {
  IChatConversation,
  IChatMessage,
  IMessage,
} from '../../../shared/interfaces/others.interfaces';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { UserService } from '../../../core/services/user.service';
@Component({
  selector: 'app-conversation-message',
  templateUrl: './conversation-message.component.html',
  styleUrls: ['./conversation-message.component.scss'],
  animations: [fadeInOutAnimation],
})
export class ConversationMessageComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {
  @ViewChild('messagesList') messagesListRef!: ElementRef;
  
  subscription$: Subscription = new Subscription();

  currentTextingMessage: string = '';

  currentConversationId: string = '';
  currentConversation!: IChatConversation | undefined;

  currentUserId: string = '';
  messages: IChatMessage[] = [];

  constructor(
    private route: ActivatedRoute,
    private chat: ChatService,
    private user: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listenToUser();
    this.listenToRoute();
    this.listenToChat();
  }

  ngAfterViewInit() {
    this.scrollToBottom(); // Scroll after the view initializes
  }

  ngAfterViewChecked() {
    // this.scrollToBottom(); // Scroll after new messages are added
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.currentUserId = user?.id ?? '';
      })
    );
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.params.subscribe((params) => {
        this.currentConversationId = params['conversationId'];
        this.currentConversation = this.chat.conversations$.value.find(
          (c) => c.id === this.currentConversationId
        );
        this.handleInitMessages();
      })
    );
  }

  async handleInitMessages() {
    const result = await this.chat.checkUserInConversation(
      this.currentConversationId,
      this.currentUserId
    );

    if (!result) {
      this.router.navigate(['/chat']);
      return;
    }

    this.chat.initMessages(this.currentConversationId);
  }

  listenToChat() {
    this.subscription$.add(
      this.chat.messages$.subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();
      })
    );
  }

  scrollToBottom(): void {
    try {
      setTimeout(() => {
        if (this.messagesListRef) {
          this.messagesListRef.nativeElement.scrollTop = this.messagesListRef.nativeElement.scrollHeight;
        }
      }, 0);
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  onSendMessage(e: KeyboardEvent) {
    if (
      e.key === 'Enter' &&
      this.currentTextingMessage.trim() !== '' &&
      this.user.user$.value
    ) {
      const message: IChatMessage = {
        senderId: this.user.user$.value.id,
        time: new Date().toISOString(),
        content: this.currentTextingMessage,
      };

      this.chat.addMessage(this.currentConversationId, message);
      this.currentTextingMessage = '';
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
