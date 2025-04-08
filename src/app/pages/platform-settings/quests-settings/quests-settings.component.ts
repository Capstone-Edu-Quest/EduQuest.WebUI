import { Component, ViewChild, type OnInit, TemplateRef, AfterViewChecked } from '@angular/core';
import { IQuest } from '../../../shared/interfaces/quests.interface';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { QuestsService } from '../../../core/services/quests.service';
import { faAngleDown, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-quests-settings',
  templateUrl: './quests-settings.component.html',
  styleUrl: './quests-settings.component.scss',
})
export class QuestsSettingsComponent implements OnInit {
  @ViewChild('addQuestModal') addQuestModalRef!: TemplateRef<any>;
  isLoaded: boolean = false;
  quests: IQuest[] = [];

  deleteIcon = faTrash;

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

  constructor(
    private QuestsService: QuestsService,
    private modal: ModalService
  ) {}

  ngOnInit(): void {
    this.initQuest();
  }

  initQuest() {
    this.QuestsService.getQuestsForManage().subscribe((data) => {
      if (!data?.payload) return;

      this.quests = data.payload;
      this.isLoaded = true;
    });
  }

  onConfirmSearch(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;

    this.searchText = '';
  }

  onAddQuest() {
    this.modal.updateModalContent(this.addQuestModalRef);
  }

}
