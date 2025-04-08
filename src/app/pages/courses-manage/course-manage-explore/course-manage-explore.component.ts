import { Component, type OnInit } from '@angular/core';
import {
  ICourse,
  ICourseOverview,
  ISearchCourseParams,
} from '../../../shared/interfaces/course.interfaces';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { ILCourseObject } from '@/src/app/shared/interfaces/learning-path.interfaces';
import { CoursesService } from '@/src/app/core/services/courses.service';

@Component({
  selector: 'app-course-manage-explore',
  templateUrl: './course-manage-explore.component.html',
  styleUrl: './course-manage-explore.component.scss',
  animations: [fadeInOutAnimation],
})
export class CourseManageExploreComponent implements OnInit {
  searchText: string = '';
  currentResultSearch: string = '';

  courses: ICourseOverview[] = [];

  constructor(private CourseService: CoursesService) {}

  ngOnInit(): void {}

  onConfirmSearchCourse(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;

    const courseParams: ISearchCourseParams = {
      KeywordName: encodeURIComponent(this.searchText),
      pageNo: 1,
      eachPage: 10,
    };

    this.CourseService.onSearchCourse(courseParams).subscribe((res) => {
      if (!res?.payload) return;

      this.courses = res.payload;
    });

    this.currentResultSearch = this.searchText;
    this.searchText = '';
  }
}
