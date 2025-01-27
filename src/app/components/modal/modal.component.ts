import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../core/services/modal.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),  // Initial state
        animate('100ms ease-in', style({ opacity: 1 })), // Final state
      ]),
      transition(':leave', [
        animate('100ms ease-out', style({ opacity: 0 })) // Transition to this state
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  constructor(public modal: ModalService) { }

  ngOnInit() {
  }

  onClose() {
    this.modal.updateModalContent(null);
  }

}
