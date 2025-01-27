import { animate, style, transition, trigger } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    style({ opacity: 0 }), // Initial state
    animate('150ms ease-in', style({ opacity: 1 })), // Final state
  ]),
  transition(':leave', [
    animate('150ms ease-out', style({ opacity: 0 })), // Transition to this state
  ]),
]);
