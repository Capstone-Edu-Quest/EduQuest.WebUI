import { CoursesService } from 'src/app/core/services/courses.service';
import { Component, OnInit } from '@angular/core';
import {
  ICourse,
  ICourseOverview,
} from '../../../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-home-studying',
  templateUrl: './home-studying.component.html',
  styleUrls: ['./home-studying.component.scss'],
})
export class HomeStudyingComponent implements OnInit {
  courses: ICourseOverview[] = [];

  constructor(private CoursesService: CoursesService) {}

  ngOnInit() {
    this.initCourse();
  }

  initCourse() {
    const course$ = this.CoursesService.onGetStudyingCourses();
    course$.subscribe((res) => {
      if (!res?.payload) return;

      this.courses = res.payload;
    });
  }
}
