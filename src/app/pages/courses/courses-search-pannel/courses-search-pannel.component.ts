import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { CourseSortEnum } from 'src/app/shared/enums/course.enum';
import { IFilterCourseOption } from 'src/app/shared/interfaces/course.interfaces';

@Component({
  selector: 'app-courses-search-pannel',
  templateUrl: './courses-search-pannel.component.html',
  styleUrls: ['./courses-search-pannel.component.scss'],
})
export class CoursesSearchPannelComponent implements OnInit {
  @Output() onChange: EventEmitter<IFilterCourseOption> = new EventEmitter();

  clearIcon = faX;

  sortBy: string | null = null;
  ratingOpt: string | null = null;
  TagListId: string[] = [];

  sortOptions = [
    {
      value: CourseSortEnum.SORT_MOST_FEEDBACKS,
      label: 'SORT_MOST_FEEDBACKS',
    },
    {
      value: CourseSortEnum.SORT_NEWEST,
      label: 'SORT_NEWEST',
    },
    {
      value: CourseSortEnum.SORT_HIGHEST_RATING,
      label: 'SORT_HIGHEST_RATING',
    },
  ];

  starOptions = [
    {
      value: 4,
      translateValue: { value: 4 },
      label: 'FILTER_STAR',
    },
    {
      value: 3,
      translateValue: { value: 3 },
      label: 'FILTER_STAR',
    },
    {
      value: 2,
      translateValue: { value: 2 },
      label: 'FILTER_STAR',
    },
    {
      value: 1,
      translateValue: { value: 2 },
      label: 'FILTER_STAR',
    },
  ];

  constructor() {}
  ngOnInit() {}

  handleFilterChange(key: string, val: any) {
    switch (key) {
      case 'SORT':
        this.sortBy = val;
        break;
      case 'RATING':
        this.ratingOpt = val;
        break;
    }

    this.onChange.emit({
      Sort: Number(this.sortBy) as CourseSortEnum,
      Rating: Number(this.ratingOpt) as number,
      TagListId: this.TagListId,
    });
  }

  onClearSort() {
    this.sortBy = null;
    this.handleFilterChange('SORT', null);
  }

  onClearReview() {
    this.sortBy = null;
    this.handleFilterChange('RATING', null);
  }
}
