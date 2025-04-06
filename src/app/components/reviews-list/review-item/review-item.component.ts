import { IReview } from '@/src/app/shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-review-item',
  templateUrl: './review-item.component.html',
  styleUrl: './review-item.component.scss',
})
export class ReviewItemComponent implements OnInit {
  @Input('review') review!: IReview;

  starsList: any[] = []

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  constructor(private router: Router) {}
  ngOnInit(): void {
    this.initStars();
  }

  onViewProfile() {
    if(!this.review) return;

    this.router.navigate(['profile', this.review.createdBy.id])
  }

  initStars() {
    if (!this.review) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.review.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

}
