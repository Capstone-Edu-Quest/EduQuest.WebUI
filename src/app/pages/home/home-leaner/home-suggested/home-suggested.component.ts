import { CoursesService } from './../../../../core/services/courses.service';
import { Component, OnInit } from '@angular/core';
import {
  ICourse,
  ICourseOverview,
} from '../../../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-home-suggested',
  templateUrl: './home-suggested.component.html',
  styleUrls: ['./home-suggested.component.scss'],
})
export class HomeSuggestedComponent implements OnInit {
  courses: ICourseOverview[] = [];

  constructor(private CoursesService: CoursesService) {}

  ngOnInit() {
    this.initCoursesList();
  }

  initCoursesList() {
    const course$ = this.CoursesService.onSearchCourse({
      pageNo: 1,
      eachPage: 40,
      isPublic: true,
      isStudying: false,
    });
    course$.subscribe((res) => {
      if (!res || !res?.payload) return;
      this.courses = res.payload;
    });
  }
}
