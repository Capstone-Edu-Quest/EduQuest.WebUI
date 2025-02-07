import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingCount: number = 0;
  public readonly loading$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor() {}

  addLoading() {
    this.loadingCount++;
    this.loading$.next(true);
  }

  removeLoading() {
    this.loadingCount--;
    this.loading$.next(this.loadingCount > 0);
  }

  forceOffLoading() {
    this.loadingCount = 0;
    this.loading$.next(false);
  }
}
