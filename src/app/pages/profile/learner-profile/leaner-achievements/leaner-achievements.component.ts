import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../../shared/interfaces/quests.interfaces';
import { IUser } from '../../../../shared/interfaces/user.interfaces';

@Component({
  selector: 'app-leaner-achievements',
  templateUrl: './leaner-achievements.component.html',
  styleUrls: ['./leaner-achievements.component.scss']
})
export class LeanerAchievementsComponent implements OnInit {
  @Input('user') user: IUser | null = null;

  demoAchievements: IAchievement[] = [
    // {
    //   id: '1',
    //   name: 'Quick Learner',
    //   description: 'Complete 5 lessons in 1 hour',
    //   rewardedAt: new Date().toISOString()
    // },
    // {
    //   id: '2',
    //   name: 'Quick Learner',
    //   description: 'Complete 5 lessons in 1 hour',
    //   rewardedAt: new Date().toISOString()
    // },
    // {
    //   id: '3',
    //   name: 'Quick Learner',
    //   description: 'Complete 5 lessons in 1 hour',
    //   rewardedAt: new Date().toISOString()
    // },
    // {
    //   id: '4',
    //   name: 'Quick Learner',
    //   rewardedAt: new Date().toISOString(),
    //   description: 'Complete 5 lessons in 1 hour'
    // },
    // {
    //   id: '5',
    //   name: 'Quick Learner',
    //   description: 'Complete 5 lessons in 1 hour',
    //   rewardedAt: new Date().toISOString()
    // },
  ]
  constructor() { }

  ngOnInit() {
  }

}
