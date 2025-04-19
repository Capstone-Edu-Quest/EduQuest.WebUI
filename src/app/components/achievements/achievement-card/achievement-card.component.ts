import { QuestsService } from './../../../core/services/quests.service';
import { Component, Input, OnInit } from '@angular/core';
import { IQuestOfUser } from '@/src/app/shared/interfaces/quests.interface';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  @Input('achievement') achievement: IQuestOfUser | null = null;

  constructor(private QuestsService: QuestsService) {}

  rewardedTime = {
    date: '',
    month: '',
    year: '',
  };

  questValue = {};

  ngOnInit() {
    if (this.achievement) {
      const time = new Date(this.achievement.completeDate as string)
        .toLocaleDateString()
        .split('/');
      this.rewardedTime = {
        date: Number(time[0]) < 10 ? `0${time[0]}` : time[0],
        month: Number(time[1]) < 10 ? `0${time[1]}` : time[1],
        year: Number(time[2]) < 10 ? `0${time[2]}` : time[2],
      };

      this.achievement.questValue?.forEach((q, idx) => {
        this.questValue = { ...this.questValue, [`${idx}`]: q };
      });
    }
  }

  getQuestLabel() {
    if (!this.achievement) return '';

    return this.QuestsService.getMissionLabel(this.achievement.questType);
  }
}
