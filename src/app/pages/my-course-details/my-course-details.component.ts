import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-course-details',
  templateUrl: './my-course-details.component.html',
  styleUrl: './my-course-details.component.scss',
})
export class MyCourseDetailsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  courseId!: string | null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.listenToRoute();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const courseId = params.get('courseId');
        this.courseId = courseId;
        this.initCourse();
      })
    );
  }

  initCourse() {
    // Fetch course details from API
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
