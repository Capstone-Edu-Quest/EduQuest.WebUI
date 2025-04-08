import { Component, Input, OnInit } from '@angular/core';
import { IAchievement } from '../../../../shared/interfaces/quests.interfaces';
import { IProfile, IUser } from '../../../../shared/interfaces/user.interfaces';
import { IQuestOfUser } from '@/src/app/shared/interfaces/quests.interface';

@Component({
  selector: 'app-leaner-achievements',
  templateUrl: './leaner-achievements.component.html',
  styleUrls: ['./leaner-achievements.component.scss']
})
export class LeanerAchievementsComponent implements OnInit {
  @Input('user') user: IProfile | null = null;

  completedQuests: IQuestOfUser[] = [];
  
  constructor() { }

  ngOnInit() {
  }

}
