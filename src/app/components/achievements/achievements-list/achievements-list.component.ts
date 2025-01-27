import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../shared/interfaces/QuestsInterface';

@Component({
  selector: 'app-achievements-list',
  templateUrl: './achievements-list.component.html',
  styleUrls: ['./achievements-list.component.scss'],
})
export class AchievementsListComponent implements OnInit {
  @Input('achievements') achievements: IAchievement[] = [];
  currentViewIndex: number = 0;

  constructor() {}

  ngOnInit() {}

  updateViewIndex(value: number) {
    if (this.achievements.length <= 4) return;

    const tempIdx = this.currentViewIndex + value;
    this.currentViewIndex =
      tempIdx < 0
        ? this.achievements.length - 1 - 3
        : tempIdx > this.achievements.length - 1 - 3
        ? 0
        : tempIdx;
  }
}
