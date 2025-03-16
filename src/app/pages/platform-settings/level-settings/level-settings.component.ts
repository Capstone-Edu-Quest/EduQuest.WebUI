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
import { RewardTypeEnum } from '../../../shared/enums/others.enum';
import { QuestsService } from '../../../core/services/quests.service';
import {
  faMinus,
  faPen,
  faPlus,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { MessageService } from '../../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

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
  @ViewChild('deleteLevel') deleteLevelRef!: TemplateRef<any>;

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
  deletedLevels: number[] = [];

  // -------------
  rewardTypeSelectOptions: { value: string | number; label: string }[] = [];
  boosterTypeOptions: { value: string | number; label: string }[] = [];
  foxItemOptions: { value: string | number; label: string }[] = [];

  newIcon = faPlus;
  editIcon = faPen;
  removeIcon = faMinus;
  recoverIcon = faRotateLeft;

  constructor(
    private quests: QuestsService,
    private message: MessageService,
    private translate: TranslateService
  ) {}
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
          customClass: (row: ILevel) => this.onGetDeletedState(row),
        },
        {
          key: 'exp',
          label: 'LABEL.EXP',
          elementRef: this.expInputRef,
          customClass: (row: ILevel) => this.onGetDeletedState(row),
        },
        {
          key: 'reward',
          label: 'LABEL.REWARD',
          elementRef: this.rewardInputRef,
          customClass: (row: ILevel) => this.onGetDeletedState(row),
        },
        {
          key: 'action',
          label: '',
          elementRef: this.deleteLevelRef,
        },
      ]
    );
  }

  onGetDeletedState(row: ILevel) {
    return this.deletedLevels.includes(row.id) ? 'isRemoved' : '';
  }

  onAddLevel() {
    this.isEdit = !this.isEdit;
    this.changePage$.emit(-1);

    const newLevel: ILevel = {
      id: this.levels.length + 1,
      exp: 0,
      rewardType: [],
      rewardValue: [],
    };
    this.editingLevels = JSON.parse(
      JSON.stringify(this.isEdit ? [...this.levels, newLevel] : [])
    );
  }

  onEditLevel() {
    this.isEdit = !this.isEdit;
    this.changePage$.next(1);
    this.editingLevels = JSON.parse(
      JSON.stringify(this.isEdit ? this.levels : [])
    );
    this.deletedLevels = [];
  }

  validateSaveLevels() {
    for (let i = 0; i < this.editingLevels.length; i++) {
      // Check no exp
      if (
        (this.editingLevels[i].exp === 0 && i !== 0) ||
        this.editingLevels[i].exp < 0
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.EXP_ZERO')
        );
        return;
      }

      // CHeck exp
      if (this.editingLevels[i].rewardType.length === 0) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.EMPTY_REWARD')
        );
        return;
      }

      if (
        this.editingLevels[i].rewardValue.some((v) =>
          typeof v === 'string' ? v.length <= 0 : v <= 0
        )
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.REWARD_ZERO')
        );
        return;
      }

      // Check dup reward type
      const dupRewardErr = [];
      this.editingLevels[i].rewardType.forEach((type, idx) => {
        if (
          this.editingLevels[i].rewardType.filter((t) => t === type).length > 1
        ) {
          dupRewardErr.push(type);
        }
      });
      if (dupRewardErr.length > 0) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.DUPLICATE_REWARD')
        );
        return;
      }
    }

    return true;
  }

  onSaveLevel() {
    // Validate
    const result = this.validateSaveLevels();

    if (!result) return;

    console.log('pass');
    const updatedLevels: ILevel[] = [];

    // compare
    this.editingLevels.forEach((level, i) => {
      if (JSON.stringify(level) !== JSON.stringify(this.levels[i])) {
        updatedLevels.push(level);
      }
    });

    this.isEdit = false;
    this.levels = JSON.parse(JSON.stringify(this.editingLevels))
      .filter((l: ILevel) => !this.deletedLevels.includes(l.id))
      .map((level: ILevel, i: number) => ({ ...level, id: i + 1 }));

    console.log('modified:', JSON.parse(JSON.stringify(this.editingLevels)));
    console.log('result (re-ordered):', this.levels);
    console.log('deleted:', this.deletedLevels);

    this.deletedLevels = [];
  }

  onDeleteLevel(level: ILevel) {
    const idx = this.deletedLevels.findIndex((l) => l === level.id);

    if (idx === -1) {
      this.deletedLevels.push(level.id);
      return;
    }

    this.deletedLevels.splice(idx, 1);
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

  onAddReward(level: ILevel) {
    if (level.rewardType.length >= this.rewardTypeSelectOptions.length) return;

    level.rewardType.push(RewardTypeEnum.GOLD);
    level.rewardValue.push(1);
  }

  onRemoveReward(level: ILevel, idx: number) {
    level.rewardType.splice(idx, 1);
    level.rewardValue.splice(idx, 1);
  }

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
