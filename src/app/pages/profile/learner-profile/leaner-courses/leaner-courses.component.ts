import { Component, Input, OnInit } from '@angular/core';
import { ICourse } from '../../../../shared/interfaces/course.interfaces';
import { Router } from '@angular/router';
import { IUser } from '../../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-leaner-courses',
  templateUrl: './leaner-courses.component.html',
  styleUrls: ['./leaner-courses.component.scss'],
})
export class LeanerCoursesComponent implements OnInit {
  @Input('isStaffView') isStaffView: boolean = false;
  @Input('user') user: IUser | null = null;

  currentViewIndex: number = 0;
  sampleCourses: ICourse[] = []

  constructor(private router: Router) {}

  ngOnInit() {}

  updateViewIndex(value: number) {
    if (this.sampleCourses.length <= 2) return;

    const tempIdx = this.currentViewIndex + value;
    this.currentViewIndex =
      tempIdx < 0
        ? this.sampleCourses.length - 2
        : tempIdx > this.sampleCourses.length - 2
        ? 0
        : tempIdx;
  }

  viewCourseDetails(courseId: string) {
    this.router.navigate([this.isStaffView ? '/courses-manage/explore' : '/courses', courseId]);
  }
}
