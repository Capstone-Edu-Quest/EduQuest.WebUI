import { Component, Input, type OnInit } from '@angular/core';
import { IReview } from '../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.scss',
})
export class ReviewsListComponent implements OnInit {
  @Input('reviews') reviews!: IReview[];
  @Input('bg') bg: string = '';

  ngOnInit(): void { }

}
