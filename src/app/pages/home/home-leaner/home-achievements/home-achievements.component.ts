import { Component, OnInit } from '@angular/core';
import { IAchievement } from '../../../../shared/interfaces/quests.interfaces';

@Component({
  selector: 'app-home-achievements',
  templateUrl: './home-achievements.component.html',
  styleUrls: ['./home-achievements.component.scss']
})
export class HomeAchievementsComponent implements OnInit {

  demoAchievements: IAchievement[] = [
    {
      id: '1',
      name: 'Quick Learner',
      description: 'Complete 5 lessons in 1 hour',
      rewardedAt: new Date().toISOString()
    },
    {
      id: '1',
      name: 'Quick Learner',
      description: 'Complete 5 lessons in 1 hour',
      rewardedAt: new Date().toISOString()
    },
    {
      id: '1',
      name: 'Quick Learner',
      description: 'Complete 5 lessons in 1 hour',
      rewardedAt: new Date().toISOString()
    },
    {
      id: '1',
      name: 'Quick Learner',
      rewardedAt: new Date().toISOString(),
      description: 'Complete 5 lessons in 1 hour'
    },
    {
      id: '1',
      name: 'Quick Learner',
      description: 'Complete 5 lessons in 1 hour',
      rewardedAt: new Date().toISOString()
    },
  ]

  constructor() { }

  ngOnInit() {
  }

}
