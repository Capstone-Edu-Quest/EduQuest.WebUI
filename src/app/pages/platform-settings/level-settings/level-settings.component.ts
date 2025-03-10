import {
  Component,
  ViewChild,
  type OnInit,
  TemplateRef,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { ILevel } from '../../../shared/interfaces/Platform.interface';
import { BoosterEnum, RewardTypeEnum } from '../../../shared/enums/others.enum';
import { QuestsService } from '../../../core/services/quests.service';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../../core/services/modal.service';
import { Subscription } from 'rxjs';
import { FoxItems } from '../../../components/fox-3d/3d-setup/fox-3d.config';

@Component({
  selector: 'app-level-settings',
  templateUrl: './level-settings.component.html',
  styleUrl: './level-settings.component.scss',
})
export class LevelSettingsComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('expInput') expInputRef!: TemplateRef<any>;
  @ViewChild('rewardInput') rewardInputRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();
  changePage$: EventEmitter<number> = new EventEmitter<number>();

  // -------------
  isEdit: boolean = false;
  editingColumns: TableColumn[] = [];

  tableColumns: TableColumn[] = [
    {
      key: 'id',
      label: 'LABEL.LEVELS',
    },
    {
      key: 'exp',
      label: 'LABEL.EXP',
      render: (data: ILevel) => data.exp.toLocaleString(),
    },
    {
      key: 'reward',
      label: 'LABEL.REWARD',
      render: (data: ILevel) =>
        this.quests.getAllRewardsString(data.rewardType, data.rewardValue),
    },
  ];

  // -------------
  levels: ILevel[] = [
    { id: 1, exp: 0, rewardType: [RewardTypeEnum.GOLD], rewardValue: [5] },
    { id: 2, exp: 150, rewardType: [RewardTypeEnum.GOLD], rewardValue: [10] },
    {
      id: 3,
      exp: 400,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.BOOSTER],
      rewardValue: [300, 1],
    },
    { id: 4, exp: 800, rewardType: [RewardTypeEnum.GOLD], rewardValue: [15] },
    {
      id: 5,
      exp: 1300,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.ITEM],
      rewardValue: [20, 'balloon'],
    },
    {
      id: 6,
      exp: 1900,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [25],
    },
    {
      id: 7,
      exp: 2600,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.BOOSTER],
      rewardValue: [30, 1],
    },
    {
      id: 8,
      exp: 3400,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [35],
    },
    {
      id: 9,
      exp: 4300,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.ITEM],
      rewardValue: [40, 'wings'],
    },
    {
      id: 10,
      exp: 5300,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [45],
    },
    {
      id: 11,
      exp: 6400,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.BOOSTER],
      rewardValue: [50, 1],
    },
    {
      id: 12,
      exp: 7600,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [55],
    },
    {
      id: 13,
      exp: 8900,
      rewardType: [RewardTypeEnum.GOLD, RewardTypeEnum.ITEM],
      rewardValue: [60, 'katana'],
    },
    {
      id: 14,
      exp: 10300,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [65],
    },
    {
      id: 15,
      exp: 11800,
      rewardType: [
        RewardTypeEnum.GOLD,
        RewardTypeEnum.BOOSTER,
        RewardTypeEnum.ITEM,
      ],
      rewardValue: [70, 1, 'gold-belt'],
    },
  ];

  editingLevels: ILevel[] = [];

  // -------------
  rewardTypeSelectOptions: { value: string | number; label: string }[] = [];
  boosterTypeOptions: { value: string | number; label: string }[] = [];
  foxItemOptions: { value: string | number; label: string }[] = [];

  newIcon = faPlus;
  editIcon = faPen;

  constructor(private quests: QuestsService, private modal: ModalService) {}
  ngOnInit(): void {
    this.onInitSelectOptions();
    console.log(this.levels);
  }

  ngAfterViewInit(): void {
    this.editingColumns.push(
      ...[
        {
          key: 'id',
          label: 'LABEL.LEVELS',
        },
        {
          key: 'exp',
          label: 'LABEL.EXP',
          elementRef: this.expInputRef,
        },
        {
          key: 'reward',
          label: 'LABEL.REWARD',
          elementRef: this.rewardInputRef,
        },
      ]
    );
  }

  onAddLevel() {
    this.isEdit = !this.isEdit;
    this.changePage$.emit(-1);

    const newLevel: ILevel = {
      id: this.levels.length + 1,
      exp: 0,
      rewardType: [RewardTypeEnum.GOLD],
      rewardValue: [0],
    };
    this.editingLevels = JSON.parse(
      JSON.stringify(this.isEdit ? [...this.levels, newLevel] : [])
    );
  }

  onEditLevel() {
    this.isEdit = !this.isEdit;
    this.editingLevels = JSON.parse(
      JSON.stringify(this.isEdit ? this.levels : [])
    );
  }

  onSaveLevel() {
    const updatedLevels: ILevel[] = [];

    // compare
    this.editingLevels.forEach((level, i) => {
      if (JSON.stringify(level) !== JSON.stringify(this.levels[i])) {
        updatedLevels.push(level);
      }
    });

    this.isEdit = false;
    this.levels = JSON.parse(JSON.stringify(this.editingLevels));

    console.log(updatedLevels);
  }

  onInitSelectOptions() {
    this.rewardTypeSelectOptions = Object.keys(RewardTypeEnum)
      .filter((key) => isNaN(Number(key)))
      .map((key) => ({
        label: this.quests.getRewardTypeLabel(
          RewardTypeEnum[key as keyof typeof RewardTypeEnum]
        ),
        value: RewardTypeEnum[key as keyof typeof RewardTypeEnum],
      }));

    this.boosterTypeOptions = this.quests.getRewardOptions(
      RewardTypeEnum.BOOSTER
    );
    this.foxItemOptions = this.quests.getRewardOptions(RewardTypeEnum.ITEM);
  }

  onAddReward() {}

  onGetInputType(rewardType: RewardTypeEnum) {
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

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
