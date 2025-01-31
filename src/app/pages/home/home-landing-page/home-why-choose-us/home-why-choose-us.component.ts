import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-why-choose-us',
  templateUrl: './home-why-choose-us.component.html',
  styleUrls: ['./home-why-choose-us.component.scss'],
})
export class HomeWhyChooseUsComponent implements OnInit {
  items = [
    {
      title: 'LABEL.PERSONALIZED_LEARNING_TITLE',
      content: 'LABEL.PERSONALIZED_LEARNING_CONTENT',
    },
    {
      title: 'LABEL.GAMIFIED_MOTIVATION_TITLE',
      content: 'LABEL.GAMIFIED_MOTIVATION_CONTENT',
    },
    {
      title: 'LABEL.EXPERTISE_TITLE',
      content: 'LABEL.EXPERTISE_CONTENT',
    },
    {
      title: 'LABEL.PROGRESS_TRACKING_TITLE',
      content: 'LABEL.PROGRESS_TRACKING_CONTENT',
    },
    {
      title: 'LABEL.COMMUNITY_SUPPORT_TITLE',
      content: 'LABEL.COMMUNITY_SUPPORT_CONTENT',
    },
  ];

  constructor() {}

  ngOnInit() {}
}
