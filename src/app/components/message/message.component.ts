import { animate, query, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from '../../core/services/message.service';
import { Subscription } from 'rxjs';
import { IMessage } from '../../shared/interfaces/OthersInterface';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  animations: [
    trigger('messageAnimation', [
      // Enter animation
      transition(':enter', [
        style({ transform: 'translateY(-20px) translateX(-50%)', opacity: 0 }),
        animate(
          '300ms ease-out',
          style({ transform: 'translateY(0) translateX(-50%)', opacity: 1 })
        ),
      ]),
      // Leave animation
      transition(':leave', [
        style({ transform: 'translateY(0) translateX(-50%)', opacity: 1 }), // Start from current position
        animate('300ms ease-in', style({ transform: 'translateY(-20px) translateX(-50%)', opacity: 0 })), // Move 20px up
      ]),
    ]),
  ],
})
export class MessageComponent implements OnInit {
  messages: IMessage[] = [];
  subscription$: Subscription = new Subscription();

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.subscription$.add(
      this.messageService.messages$.subscribe((messages) => {
        this.messages = messages;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
