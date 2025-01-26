import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../shared/interfaces/QuestsInterface';

@Component({
  selector: 'app-achievement-card',
  templateUrl: './achievement-card.component.html',
  styleUrls: ['./achievement-card.component.scss'],
})
export class AchievementCardComponent implements OnInit {
  @Input('achievement') achievement: IAchievement | null = null;
  constructor() {}

  ngOnInit() {}
}
