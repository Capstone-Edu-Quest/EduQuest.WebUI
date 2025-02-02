import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { IChatConversation } from '../../../shared/interfaces/OthersInterface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-chat',
  templateUrl: './navbar-chat.component.html',
  styleUrls: ['./navbar-chat.component.scss'],
})
export class NavbarChatComponent implements OnInit, OnDestroy {
  conversations: IChatConversation[] = [];
  subscription$: Subscription = new Subscription();

  constructor(private chat: ChatService, private router: Router) {}

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

  viewConversation(id: string) {
    this.router.navigate(['/chat', id]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
