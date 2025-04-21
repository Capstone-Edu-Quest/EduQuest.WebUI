import { Component, OnDestroy, type OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import {
  faBookOpen,
  faDollarSign,
  faStar,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { PlatformService } from '@/src/app/core/services/platform.service';

@Component({
  selector: 'app-home-instructor-summary',
  templateUrl: './home-instructor-summary.component.html',
  styleUrl: './home-instructor-summary.component.scss',
})
export class HomeInstructorSummaryComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  user!: IUser | null;
  statsItem: any[] = [];
  totalRevenue = 0;

  constructor(
    private UserService: UserService,
    private platform: PlatformService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initStats();
  }

  initStats() {
    this.statsItem = [
      {
        label: 'LABEL.TOTAL_COURSES',
        value: 0,
        icon: faBookOpen,
      },
      {
        label: 'LABEL.TOTAL_LEANERS',
        value: 0,
        icon: faUsers,
      },
      {
        label: 'LABEL.AVERAGE_RATING',
        value: 0,
        icon: faStar,
      },
    ];
    this.totalRevenue = 0;

    this.platform.getInstructorHomeStatistics().subscribe((res) => {
      if (!res?.payload) return;
      const stat = res.payload as any;

      this.totalRevenue = stat.totalRevenue;
      this.statsItem = [
        {
          label: 'LABEL.TOTAL_COURSES',
          value: stat.totalCourses,
          icon: faBookOpen,
        },
        {
          label: 'LABEL.TOTAL_LEANERS',
          value: stat.totalLearners,
          icon: faUsers,
        },
        {
          label: 'LABEL.AVERAGE_RATING',
          value: stat.averageReviews,
          icon: faStar,
        },
      ];
    });
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
