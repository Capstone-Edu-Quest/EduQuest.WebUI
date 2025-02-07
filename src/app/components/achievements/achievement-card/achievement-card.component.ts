import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../shared/interfaces/quests.interfaces';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  @Input('achievement') achievement: IAchievement | null = null;
  constructor() {}

  rewardedTime = {
    date: '',
    month: '',
    year: ''
  };
  ngOnInit() {
    if(this.achievement) {
      const time = new Date(this.achievement.rewardedAt).toLocaleDateString().split('/')
      this.rewardedTime = {
        date: Number(time[0]) < 10 ? `0${time[0]}` : time[0],
        month: Number(time[1]) < 10 ? `0${time[1]}` : time[1],
        year: Number(time[2]) < 10 ? `0${time[2]}` : time[2]
      };
    }
  }
}
