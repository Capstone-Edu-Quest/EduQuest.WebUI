import { UserService } from '@/src/app/core/services/user.service';
import { Component, OnDestroy, type OnInit } from '@angular/core';
import {
  faBook,
  faBookMedical,
  faHashtag,
  faUser,
  faUserPlus,
  faUsersRays,
  faWarning,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-overview',
  templateUrl: './home-overview.component.html',
  styleUrl: './home-overview.component.scss',
})
export class HomeOverviewComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  statsItem: any[] = [];

  constructor(private user: UserService) {}

  ngOnInit(): void {
    this.listenToAdminDashboard();
  }

  listenToAdminDashboard() {
    this.subscription$.add(
      this.user.adminDashboard$.subscribe((res) => {
        if (!res) return;

        this.statsItem = [
          {
            label: 'LABEL.PENDING_VIOLATIONS',
            value: res.pendingViolations,
            icon: faWarning,
          },
          {
            label: 'LABEL.TOTAL_COURSES',
            value: res.adminDashboardCourses.totalCourses,
            icon: faBook,
          },
          {
            label: 'LABEL.NEW_COURSES_THIS_MONTH',
            value: res.adminDashboardCourses.newCoursesThisMonth,
            icon: faBookMedical,
          },
          {
            label: 'LABEL.MOST_POPULAR_CATEGORY',
            value: res.adminDashboardCourses.mostPopularCategory,
            icon: faHashtag,
          },
        ];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
