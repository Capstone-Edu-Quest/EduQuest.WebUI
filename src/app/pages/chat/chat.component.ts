import { Component, OnInit } from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  animations: [fadeInOutAnimation]
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
