import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-checkboxGroup',
  templateUrl: './checkboxGroup.component.html',
  styleUrls: ['./checkboxGroup.component.scss'],
})
export class CheckboxGroupComponent implements OnInit {
  @Input('name') name: string = '';
  @Input('value') value: string = '';
  @Input('showStar') showStar: boolean = false;
  @Input('options') options: {
    value: any;
    label: any;
    translateValue?: Object;
  }[] = [];
  @Output('onChange') onChange$: EventEmitter<string> =
    new EventEmitter<string>();

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  constructor() {}

  ngOnInit() {}

  onSelect(value: string) {
    this.onChange$.emit(value);
  }

  initStars(value: any) {
    const star = Number(value);
    if(isNaN(star)) return [];
    
    const starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = value - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });

    return starsList;
  }
}
