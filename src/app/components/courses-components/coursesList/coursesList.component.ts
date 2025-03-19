import { Component, Input, OnInit } from '@angular/core';
import { ICourseOverview } from '../../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-coursesList',
  templateUrl: './coursesList.component.html',
  styleUrls: ['./coursesList.component.scss'],
})
export class CoursesListComponent implements OnInit {
  @Input('notShowFooter') notShowFooter: boolean = false;
  @Input('courses') courses: ICourseOverview[] = [];
  currentViewIndex: number = 0;

  constructor() {}

  ngOnInit() {}

  updateViewIndex(value: number) {
    if (this.courses.length <= 3) return;

    const tempIdx = this.currentViewIndex + value;
    this.currentViewIndex =
      tempIdx < 0
        ? this.courses.length - 1 - 2
        : tempIdx > this.courses.length - 1 - 2
        ? 0
        : tempIdx;
  }
}
