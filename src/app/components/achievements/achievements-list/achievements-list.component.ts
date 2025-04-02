import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../shared/interfaces/quests.interfaces';
import { IQuestOfUser } from '@/src/app/shared/interfaces/quests.interface';

@Component({
  selector: 'app-achievements-list',
  templateUrl: './achievements-list.component.html',
  styleUrls: ['./achievements-list.component.scss'],
})
export class AchievementsListComponent implements OnInit {
  @Input('achievements') achievements: IQuestOfUser[] = [];
  @Input('appearPerRow') appearPerRow: number = 4;
  currentViewIndex: number = 0;

  constructor() {}

  ngOnInit() {}

  updateViewIndex(value: number) {
    if (this.achievements.length <= this.appearPerRow) return;

    const tempIdx = this.currentViewIndex + value;
    this.currentViewIndex =
      tempIdx < 0
        ? this.achievements.length - this.appearPerRow
        : tempIdx > this.achievements.length - this.appearPerRow
        ? 0
        : tempIdx;
  }
}
