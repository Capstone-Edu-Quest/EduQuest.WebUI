import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-leaner-profile-info',
  templateUrl: './leaner-profile-info.component.html',
  styleUrls: ['./leaner-profile-info.component.scss']
})
export class LeanerProfileInfoComponent implements OnInit {
  statItems = [
    {
      icon: 'trophy',
      label: 'LABEL.RANK',
      value: '#1'
    },
    {
      icon: 'fire',
      label: 'LABEL.HIGHEST_LEARNING_STREAK',
      value: '15 days'
    },
    {
      icon: 'clock-circle',
      label: 'LABEL.TOTAL_LEARNING_TIME',
      value: '232 minutes'
    },
    {
      icon: 'book',
      label: 'LABEL.TOTAL_LEARNING_COURSES',
      value: '3 courses'
    },
    {
      icon: 'heart',
      label: 'LABEL.FAVOURITE_TOPICS',
      value: 'Reacts, Angular, Vue'
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
