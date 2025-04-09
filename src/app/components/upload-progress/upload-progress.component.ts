import { Component, OnDestroy, type OnInit } from '@angular/core';
import { LoadingService } from '../../core/services/loading.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-progress',
  templateUrl: './upload-progress.component.html',
  styleUrl: './upload-progress.component.scss',
})
export class UploadProgressComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  progressValue: number | null = null;

  constructor(private loading: LoadingService) {}

  ngOnInit(): void {
    this.listenToProgress();
  }

  listenToProgress() {
    this.subscription$.add(
      this.loading.progress$.subscribe((value) => (this.progressValue = value))
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
