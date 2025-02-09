import { Component, OnDestroy, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-my-course-add',
  templateUrl: './my-course-add.component.html',
  styleUrl: './my-course-add.component.scss',
})
export class MyCourseAddComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  isEdit: boolean = false;
  courseId!: string | null ;

  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.initView();
  }

  initView() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const courseId = params.get('courseId'); 
        this.courseId = courseId;
        this.isEdit = Boolean(courseId);
      })
    );
  }
  

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
