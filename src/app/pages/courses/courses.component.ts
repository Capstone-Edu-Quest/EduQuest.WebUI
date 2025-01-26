import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.scss'],
})
export class CoursesComponent implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute) {}

  searchKeyword: string = '';
  subscription$: Subscription = new Subscription();

  ngOnInit() {
    this.subscription$.add(
      this.route.queryParams.subscribe((params) => {
        this.searchKeyword = decodeURIComponent(params['keyword']);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
