import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrl: './slider.component.scss',
})
export class SliderComponent implements AfterViewInit, OnDestroy {
  @ViewChild('slider') slider!: ElementRef<HTMLDivElement>;
  @ViewChild('thumb') thumb!: ElementRef<HTMLDivElement>;

  @Input() min = 0;
  @Input() max = 100;
  @Input() value = 50;
  @Output() valueChange = new EventEmitter<number>();

  private subscriptions = new Subscription();

  ngAfterViewInit() {
    const sliderEl = this.slider.nativeElement;
    const thumbEl = this.thumb.nativeElement;

    const updateValue = (event: MouseEvent | TouchEvent) => {
      const clientX =
        event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      const rect = sliderEl.getBoundingClientRect();
      const percentage = Math.min(
        Math.max((clientX - rect.left) / rect.width, 0),
        1
      );
      this.value = this.min + percentage * (this.max - this.min);
      this.valueChange.emit(this.value);
    };

    const dragStart = fromEvent<MouseEvent | TouchEvent>(
      thumbEl,
      'mousedown'
    ).pipe(
      switchMap(() =>
        fromEvent<MouseEvent | TouchEvent>(document, 'mousemove').pipe(
          map(updateValue),
          takeUntil(fromEvent(document, 'mouseup'))
        )
      )
    );

    this.subscriptions.add(dragStart.subscribe());
    this.subscriptions.add(
      fromEvent<MouseEvent | TouchEvent>(sliderEl, 'click').subscribe((event) =>
        updateValue(event as MouseEvent | TouchEvent)
      )
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
