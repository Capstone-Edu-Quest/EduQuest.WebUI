import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ICourse,
  ICourseOverview,
  IFilterCourseOption,
  ISearchCourseParams,
} from '../../shared/interfaces/course.interfaces';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { CoursesService } from 'src/app/core/services/courses.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CoursesComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private course: CoursesService) {}

  subscription$: Subscription = new Subscription();
  searchKeyword: string = '';
  otherFilters: IFilterCourseOption = {
    Sort: null,
    Rating: null,
    TagListId: [],
  };

  courses: ICourseOverview[] = [];

  ngOnInit() {
    this.subscription$.add(
      this.route.queryParams.subscribe((params) => {
        this.searchKeyword = params['keyword']
          ? decodeURIComponent(params['keyword'])
          : '';

        this.handleSearch();
      })
    );
  }

  handleFilterChange($e: IFilterCourseOption) {
    this.otherFilters = { ...$e };
    this.handleSearch();
  }

  handleSearch() {
    const courseParams: ISearchCourseParams = {
      KeywordName: encodeURIComponent(this.searchKeyword),
      // Sort: Number(this.otherFilters.sort) as CourseSortEnum,
      // Rating: Number(this.otherFilters.ratingOpt),
      // TagListId: this.otherFilters.selectedTags,
      pageNo: 1,
      eachPage: 10,
      isPublic: true,
    };

    Object.entries(this.otherFilters).forEach(([key, value]) => {
      if (
        (Array.isArray(value) && value.length > 0) ||
        (!Array.isArray(value) && value)
      ) {
        courseParams[key as keyof ISearchCourseParams] = value;
      }
    });

    this.course
      .onSearchCourse(courseParams)
      .subscribe(
        (res) =>
          (this.courses = (res?.payload ?? []).filter(
            (c) => c.progressPercentage === null
          ))
      );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
