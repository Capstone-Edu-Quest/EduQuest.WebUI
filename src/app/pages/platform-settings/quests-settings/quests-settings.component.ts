import { Component, ViewChild, type OnInit, TemplateRef } from '@angular/core';
import { IQuest } from '../../../shared/interfaces/quests.interface';
import {
  BoosterEnum,
  QuestMissionEnum,
  QuestTypeEnum,
  RewardTypeEnum,
} from '../../../shared/enums/others.enum';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { QuestsService } from '../../../core/services/quests.service';
import { faAngleDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-quests-settings',
  templateUrl: './quests-settings.component.html',
  styleUrl: './quests-settings.component.scss',
})
export class QuestsSettingsComponent implements OnInit {
  @ViewChild('addQuestModal') addQuestModalRef!: TemplateRef<any>;

  quests: IQuest[] = [
    {
      id: 'q1',
      title: 'Busy Bee',
      type: QuestTypeEnum.DAILY,
      questType: QuestMissionEnum.LESSONS,
      questValue: [3],
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.EXP],
      rewardValue: [100, 50],
    },
    {
      id: 'q2',
      title: 'Master of quizzes',
      type: QuestTypeEnum.DAILY,
      questType: QuestMissionEnum.QUIZ_TIME,
      questValue: [5, 15],
      rewardType: [RewardTypeEnum.EXP],
      rewardValue: [200],
    },
    {
      id: 'q3',
      title: 'Learning Starter',
      type: QuestTypeEnum.ONE_TIME,
      questType: QuestMissionEnum.LEARNING_TIME,
      questValue: [60],
      rewardType: [RewardTypeEnum.BOOSTER, RewardTypeEnum.GOLD],
      rewardValue: [BoosterEnum.GOLD, 500],
    },
    {
      id: 'q4',
      title: 'Kickoff starter',
      type: QuestTypeEnum.ONE_TIME,
      questType: QuestMissionEnum.COURSES,
      questValue: [2],
      rewardType: [RewardTypeEnum.ITEM],
      rewardValue: ['wings'],
    },
    {
      id: 'q5',
      title: 'My old friend',
      type: QuestTypeEnum.DAILY,
      questType: QuestMissionEnum.STREAK,
      questValue: [7],
      rewardType: [RewardTypeEnum.COUPON, RewardTypeEnum.EXP],
      rewardValue: [1, 300],
    },
  ];

  tableColumns: TableColumn[] = [
    {
      key: 'title',
      label: 'LABEL.QUEST_NAME',
    },
    {
      key: 'type',
      label: 'LABEL.QUEST_TYPE',
      isSwitchData: true,
      translateLabel: (quest: IQuest) =>
        this.QuestsService.getQuestTypeLabel(quest.type),
    },
    {
      key: 'mission',
      label: 'LABEL.MISSION',
      translateLabel: (data: IQuest) =>
        this.QuestsService.getMissionLabel(data.questType),
      render: (data: IQuest) => {
        let value = {};
        data.questValue.forEach((q, idx) => {
          value = { ...value, [`${idx}`]: q };
        });

        return value;
      },
    },
    {
      key: 'reward',
      label: 'LABEL.REWARD',
      render: (data: IQuest) =>
        this.QuestsService.getAllRewardsString(
          data.rewardType,
          data.rewardValue
        ),
    },
  ];

  searchText = '';

  addIcon = faPlus;

  constructor(private QuestsService: QuestsService, private modal: ModalService) {}

  ngOnInit(): void {}

  onConfirmSearch(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;

    this.searchText = '';
  }

  onAddQuest() {
    this.modal.updateModalContent(this.addQuestModalRef);
  }
}
