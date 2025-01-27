import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-courses-search-pannel',
  templateUrl: './courses-search-pannel.component.html',
  styleUrls: ['./courses-search-pannel.component.scss'],
})
export class CoursesSearchPannelComponent implements OnInit {
  sortBy: string = '';
  ratingOpt: string = '';
  selectedTags: string[] = ['DSA', "React", '.Net'];

  sortOptions = [
    {
      value: 'SORT_MOST_FEEDBACKS',
      label: 'SORT_MOST_FEEDBACKS',
    },
    {
      value: 'SORT_NEWEST',
      label: 'SORT_NEWEST',
    },
    {
      value: 'SORT_HIGHEST_RATING',
      label: 'SORT_HIGHEST_RATING',
    },
  ];

  starOptions = [
    {
      value: '4.5',
      translateValue: { value: '4.5' },
      label: 'FILTER_STAR',
    },
    {
      value: '4',
      translateValue: { value: '4' },
      label: 'FILTER_STAR',
    },
    {
      value: '3.5',
      translateValue: { value: '3.5' },
      label: 'FILTER_STAR',
    },
    {
      value: '3',
      translateValue: { value: '3' },
      label: 'FILTER_STAR',
    },
    {
      value: '2.5',
      translateValue: { value: '2.5' },
      label: 'FILTER_STAR',
    },
  ];

  constructor() {}
  ngOnInit() {}

  handleFilterChange(key: string, val: string) {
    switch (key) {
      case 'SORT':
        this.sortBy = val;
        break;
      case 'RATING':
        this.ratingOpt = val;
        break;
    }
  }
}
