import { Injectable } from '@angular/core';
import { Subject, Subscription, filter } from 'rxjs';
import { EventBase } from '../../shared/models/Events';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  eventPipe$ = new Subject<EventBase>();
  private eventSubscription: Subscription | undefined;

  fireEvent(event: EventBase): void {
    this.eventPipe$.next(event);
  }

  subscribeToEvent(eventNames: string[], callback: (event: EventBase) => void): void {
    this.eventSubscription = this.eventPipe$
      .pipe(filter((event: EventBase) => eventNames.includes(event.name)))
      .subscribe(callback);
  }

  unsubscribeFromEvent(): void {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
