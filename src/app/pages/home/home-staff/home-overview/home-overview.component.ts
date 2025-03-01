import { Component, type OnInit } from '@angular/core';
import { faBook, faBookMedical, faHashtag, faUser, faUserPlus, faUsersRays, faWarning } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-overview',
  templateUrl: './home-overview.component.html',
  styleUrl: './home-overview.component.scss',
})
export class HomeOverviewComponent implements OnInit {

  statsItem = [
    {
      label: 'LABEL.TOTAL_USERS',
      value: 2123,
      icon: faUser
    },
    {
      label: 'LABEL.MONTHLY_ACTIVE_USERS',
      value: 1263,
      icon: faUsersRays
    },
    {
      label: 'LABEL.NEW_USER_THIS_MONTH',
      value: 532,
      icon: faUserPlus
    },
    {
      label: 'LABEL.PENDING_VIOLATIONS',
      value: 12,
      icon: faWarning
    },
    {
      label: 'LABEL.TOTAL_COURSES',
      value: 434,
      icon: faBook
    },
    {
      label: 'LABEL.NEW_COURSES_THIS_MONTH',
      value: 23,
      icon: faBookMedical
    },
    {
      label: 'LABEL.MOST_POPULAR_CATEGORY',
      value: '#typescript',
      icon: faHashtag
    },
  ]

  ngOnInit(): void { }

}
