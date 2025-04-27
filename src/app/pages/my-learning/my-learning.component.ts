import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ICourseOverview } from '../../shared/interfaces/course.interfaces';
import { CoursesService } from '../../core/services/courses.service';

@Component({
  selector: 'app-my-learning',
  templateUrl: './my-learning.component.html',
  styleUrl: './my-learning.component.scss',
})
export class MyLearningComponent implements OnInit {
  courses: ICourseOverview[] = [];

  constructor(private CoursesService: CoursesService) {}

  ngOnInit() {
    this.initCourse();
  }

  initCourse() {
    const course$ = this.CoursesService.onGetStudyingCourses();
    course$.subscribe((res) => {
      if (!res?.payload) return;

      this.courses = res.payload.sort((a, b) => Number(a?.progressPercentage) - Number(b?.progressPercentage));
    });
  }
}
