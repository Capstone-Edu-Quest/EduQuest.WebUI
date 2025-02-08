import { Component, OnDestroy, type OnInit } from '@angular/core';
import { UserService } from '../../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { IUser } from '../../../../shared/interfaces/user.interfaces';
import { faBookOpen, faDollarSign, faStar, faUsers } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-instructor-summary',
  templateUrl: './home-instructor-summary.component.html',
  styleUrl: './home-instructor-summary.component.scss',
})
export class HomeInstructorSummaryComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  user!: IUser | null;
  statsItem = [
    {
      label: 'LABEL.TOTAL_COURSES',
      value: 3,
      icon: faBookOpen
    },
    {
      label: 'LABEL.TOTAL_LEANERS',
      value: 12643,
      icon: faUsers
    },
    {
      label: 'LABEL.AVERAGE_RATING',
      value: 4.7,
      icon: faStar
    },
    // {
    //   label: 'LABEL.MONTHLY_REVENUE',
    //   value: 99923,
    //   icon: faDollarSign
    // }
  ]

  constructor(private UserService: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(this.UserService.user$.subscribe((user) => {
      this.user = user;
    }));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
