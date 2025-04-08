import { Component, OnDestroy, OnInit } from '@angular/core';
import { IAchievement } from '../../../../shared/interfaces/quests.interfaces';
import { QuestsService } from '@/src/app/core/services/quests.service';
import { IQuestOfUser } from '@/src/app/shared/interfaces/quests.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home-achievements',
  templateUrl: './home-achievements.component.html',
  styleUrls: ['./home-achievements.component.scss'],
})
export class HomeAchievementsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  achievements: IQuestOfUser[] = [];

  constructor(private quest: QuestsService) {}

  ngOnInit() {
    this.listenToQuest();
  }

  listenToQuest() {
    this.subscription$.add(
      this.quest.userQuests$.subscribe((quests) => {
        this.achievements = quests.filter((q) => q.isCompleted);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
