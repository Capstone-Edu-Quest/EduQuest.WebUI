import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {

  constructor() { }
  
  ngOnInit() {
  }

}
