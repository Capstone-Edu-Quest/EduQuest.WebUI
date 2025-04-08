import { Component, type OnInit } from '@angular/core';
import { faAngleDown, faMinus, faPlus, faRetweet } from '@fortawesome/free-solid-svg-icons';
import { QuestMissionEnum, QuestTypeEnum, RewardTypeEnum } from '../../../../shared/enums/others.enum';
import { QuestsService } from '../../../../core/services/quests.service';
import { TranslateService } from '@ngx-translate/core';
import { fadeInOutAnimation } from '../../../../shared/constants/animations.constant';
import { IQuest } from '../../../../shared/interfaces/quests.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'app-create-new-quest',
  templateUrl: './create-new-quest.component.html',
  styleUrl: './create-new-quest.component.scss',
  animations: [fadeInOutAnimation],
})
export class CreateNewQuestComponent implements OnInit {
  mockValue = {0: '|[]|', 1: '|[]|', 2: '|[]|', 3: '|[]|'}

  missionTypeOptions: any[]  = [];

  addIcon = faPlus;
  downIcon = faAngleDown;
  swapIcon = faRetweet;
  removeIcon = faMinus;

  newQuest: IQuest = {
    id: '',
    title: '',
    type: QuestTypeEnum.DAILY,
    questType: QuestMissionEnum.LEARNING_TIME_TIME,
    questValue: [0, 1],
    rewardType: [],
    rewardValue: [],
  }

  inputIndexSupport = 0;

  rewardTypeSelectOptions: { value: string | number; label: string }[] = [];
  boosterTypeOptions: { value: string | number; label: string }[] = [];
  foxItemOptions: { value: string | number; label: string }[] = [];

  constructor(private quest: QuestsService, private translate: TranslateService, private modal: ModalService, private message: MessageService) {}

  ngOnInit(): void {
    this.onInitMissionTypeOpt();
    this.onInitSelectOptions();
  }

  onInitSelectOptions() {
    this.rewardTypeSelectOptions = Object.keys(RewardTypeEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: this.quest.getRewardTypeLabel(
          RewardTypeEnum[key as keyof typeof RewardTypeEnum]
        ),
        value: RewardTypeEnum[key as keyof typeof RewardTypeEnum],
      }));

    this.boosterTypeOptions = this.quest.getRewardOptions(
      RewardTypeEnum.BOOSTER
    );
    this.foxItemOptions = this.quest.getRewardOptions(RewardTypeEnum.ITEM);
  }

  onInitMissionTypeOpt() {
    this.missionTypeOptions= [];

    Object.keys(QuestMissionEnum).forEach((key) => {
      if(!isNaN(Number(key))) return;
      const _k = key as keyof typeof QuestMissionEnum;
      this.missionTypeOptions.push({ value: QuestMissionEnum[_k], label: `MISSION.${_k}` });
    });
  }

  onGetQuestMissionLabel() {
    return this.quest.getMissionLabel(this.newQuest.questType);
  }

  onSwitchOption(key: QuestMissionEnum) {
    this.newQuest.questType = key;

    const newKeyInputs = this.translate.instant(this.quest.getMissionLabel(key), this.mockValue).split('|');
    this.newQuest.questValue = newKeyInputs.filter((v: string) => v === '[]').map((a: string) => Math.round(Math.random() * 10));

    this.inputIndexSupport = 0;
  }

  getInputIndex(idx: number) {
    const newKeyInputs = this.translate.instant(this.quest.getMissionLabel(this.newQuest.questType), this.mockValue).split('|');

    let inputCount = 0;
    for(let i = 0; i <= idx; i++) {
      if(newKeyInputs[i] === '[]') inputCount++;
    }

    return inputCount - 1;
  }

  onGetQuestTypeLabel() {
    return Object.keys(QuestTypeEnum).find(key => QuestTypeEnum[key as keyof typeof QuestTypeEnum] === this.newQuest.type);
  }

  onSwapQuestType() {
    this.newQuest.type = this.newQuest.type === QuestTypeEnum.DAILY ? QuestTypeEnum.ONE_TIME : QuestTypeEnum.DAILY;
  }

  onAddReward() {
    if (this.newQuest.rewardType.length >= this.rewardTypeSelectOptions.length) return;

    this.newQuest.rewardType.push(RewardTypeEnum.GOLD);
    this.newQuest.rewardValue.push(1);
  }

  onRemoveReward(idx: number) {
    this.newQuest.rewardType.splice(idx, 1);
    this.newQuest.rewardValue.splice(idx, 1);
  }

  onGetInputType(idx: number) {
    const rewardType = this.newQuest.rewardType[idx];

    switch (rewardType) {
      case RewardTypeEnum.ITEM:
        return 'item';
      case RewardTypeEnum.COUPON:
        return 'coupon';
      case RewardTypeEnum.BOOSTER:
        return 'booster';
      case RewardTypeEnum.GOLD:
      case RewardTypeEnum.EXP:
      default:
        return 'input';
    }
  }

  onCancel() {
    this.modal.updateModalContent(null);
  }

  onCreate() {
    // Check empty
    if(this.newQuest.title.trim() === '') {
      this.message.addMessage('error', this.translate.instant('MESSAGE.EMPTY_QUESTNAME'));
      return;
    }

    // check reward type
    if(this.newQuest.rewardType.length === 0) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.EMPTY_REWARD'));
      return;
    }

    // check reward value
    if(this.newQuest.rewardValue.some(val => val === 0)) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.NO_REWARD_VALUE'));
      return;
    }

    if(this.newQuest.rewardValue.some((v) =>
    typeof v === 'string' ? v.length <= 0 : v <= 0
  )) {

  }

    const dupRewardErr = [];
    this.newQuest.rewardType.forEach((type, idx) => {
      if(this.newQuest.rewardType.filter(t => t === type).length > 1) {
        dupRewardErr.push(type);
      }
    });
    if(dupRewardErr.length > 0) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.DUPLICATE_REWARD'));
      return;
    }

    this.quest.createNewQuest(this.newQuest).subscribe(res => {
      if(!res?.payload) return;

      this.message.addMessage('success', this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY'));
      this.modal.updateModalContent(null)
    })
  }
}
