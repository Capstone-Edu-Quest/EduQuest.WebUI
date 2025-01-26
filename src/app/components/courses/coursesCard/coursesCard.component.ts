import { Component, Input, OnInit } from '@angular/core';
import { ICourse } from '../../../shared/interfaces/CourseInterfaces';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { Store } from '@ngrx/store';
import { selectExchangeRates } from '../../../core/state/currency/currency.selectors';
import { TranslateService } from '@ngx-translate/core';
import { CurrencyExchangePipe } from '../../../core/pipes/currency.pipe';

@Component({
  selector: 'app-coursesCard',
  templateUrl: './coursesCard.component.html',
  styleUrls: ['./coursesCard.component.scss'],
})
export class CoursesCardComponent implements OnInit {
  @Input('course') course: ICourse | null = null;

  discounted: number = 0.7;
  
  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  constructor(private store: Store) {}

  ngOnInit() {
    this.initStars();

  }

  initStars() {
    if (!this.course) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.course?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }
}
