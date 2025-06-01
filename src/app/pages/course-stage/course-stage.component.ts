import {
  ICourse,
  ILearningMaterial,
  IMaterialOverview,
  IShardAndLevel,
} from '../../shared/interfaces/course.interfaces';
import {
  AfterViewInit,
  Component,
  Input,
  TemplateRef,
  ViewChild,
  type OnInit,
} from '@angular/core';
import {
  faCertificate,
  faCheck,
  faChevronLeft,
  faChevronRight,
  faClock,
  faInfoCircle,
  faLock,
  faPaperPlane,
  faRotateLeft,
  faStamp,
  faStar,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { MissionStatus } from '../../shared/enums/course.enum';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { copyToClipboard } from '../../core/utils/data.utils';
import { ModalService } from '../../core/services/modal.service';
import { UserService } from '../../core/services/user.service';
import { ICertificateReq } from '../../shared/interfaces/others.interfaces';
import { MessageService } from '../../core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { PaymentService } from '../../core/services/payment.service';
import { ITransactionFilterParams } from '../../shared/interfaces/transactions.interfaces';
import { IUser } from '../../shared/interfaces/user.interfaces';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-course-stage',
  templateUrl: './course-stage.component.html',
  styleUrl: './course-stage.component.scss',
  animations: [fadeInOutAnimation],
})
export class CourseStageComponent implements OnInit, AfterViewInit {
  @Input('courseDetails') courseDetails!: ICourse;

  @ViewChild('courseInfo') courseInfoRef!: TemplateRef<any>;
  @ViewChild('courseReviews') courseReviewsRef!: TemplateRef<any>;

  viewingMaterial: ILearningMaterial | null = null;

  menu: any[] = [];

  lockIcon = faLock;
  doneIcon = faCheck;
  currentIcon = faStar;
  nextIcon = faChevronRight;
  prevIcon = faChevronLeft;
  clockIcon = faClock;
  rows: any[] = [];

  totalLessons = 0;
  currentLesson = 0;

  isShowChest = false;

  isShowAddedExp = false;
  addedExp = 0;

  currentMaterials: IMaterialOverview[] = [];
  fnQueue: Function[] = [];
  userInfo: IUser | null = null;

  showRewardScreen: null | 'level' | 'shard' = null;
  addedShard = 0;

  constructor(
    private route: ActivatedRoute,
    private course: CoursesService,
    private router: Router,
    private modal: ModalService,
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService,
    private payment: PaymentService
  ) {}

  ngAfterViewInit(): void {
    this.menu = [
      {
        icon: faInfoCircle,
        label: 'LABEL.VIEW_INFO',
        action: (e: Event) => {
          this.modal.updateModalContent(this.courseInfoRef);
        },
      },
      {
        icon: faStar,
        label: 'LABEL.REVIEW',
        action: (e: Event) => {
          this.modal.updateModalContent(this.courseReviewsRef);
        },
      },
      {
        icon: faRotateLeft,
        label: 'LABEL.REFUND',
        action: (e: Event) => this.onRefund(),
      },
      {
        icon: faPaperPlane,
        label: 'LABEL.SHARE',
        action: (e: Event) => copyToClipboard(window.location.href),
      },
    ];

    if (Number(this.courseDetails.progress) > 20) {
      this.menu = this.menu.filter((m) => m.label !== 'LABEL.REFUND');
    }

    if (Number(this.courseDetails.progress) === 100) {
      this.menu.push({
        icon: faCertificate,
        label: 'LABEL.VIEW_CERTIFICATE',
        action: (e: Event) => {
          this.router.navigate(['/c', this.courseDetails.certificateId]);
        },
      });
    }
  }

  ngOnInit(): void {
    for (let i = 0; i < this.courseDetails.listLesson.length; i++) {
      const currentLesson = this.courseDetails.listLesson[i].contents.some(
        (m) => m.status === MissionStatus.CURRENT
      );

      if (currentLesson) {
        this.currentLesson = this.courseDetails.listLesson[i].index;
        break;
      }
    }

    this.initMaterials();
    this.route.queryParams.subscribe((params) => {
      const materialId = params['materialId'];

      if (!materialId) {
        this.viewingMaterial = null;
        return;
      }
      this.course.getMaterialById(materialId).subscribe((res) => {
        if (!res?.payload) {
          this.viewingMaterial = null;
          return;
        }
        this.viewingMaterial = res.payload;
      });
    });

    this.user.user$.subscribe((user) => {
      this.userInfo = user;
    });
  }

  initMaterials() {
    this.currentMaterials =
      this.courseDetails.listLesson[this.currentLesson].contents;
    this.totalLessons = this.courseDetails.listLesson.length;

    this.initRow();
  }

  initRow() {
    const itemPerRow = 4;
    this.rows = Array(Math.ceil(this.currentMaterials.length / itemPerRow));

    this.currentMaterials.forEach((material, index) => {
      const row = Math.floor(index / itemPerRow);
      if (!this.rows[row]) {
        this.rows[row] = [];
      }

      this.rows[row].push({
        ...material,
        ...this.setIconToMission(material.status ?? MissionStatus.LOCKED),
      });
    });

    for (let i = this.rows[this.rows.length - 1].length; i < itemPerRow; i++) {
      this.rows[this.rows.length - 1].push(null);
    }
  }

  updateCurrentStage(value: number) {
    this.currentLesson += value;
    this.initMaterials();
  }

  getRowLength(row: any[]) {
    let count = 0;
    row.forEach((item) => {
      if (item) {
        count++;
      }
    });

    return count;
  }

  setIconToMission(status: MissionStatus) {
    switch (status) {
      case MissionStatus.DONE:
        return {
          icon: this.doneIcon,
          class: 'done',
        };
      case MissionStatus.CURRENT:
        return {
          icon: this.currentIcon,
          class: '',
        };
      case MissionStatus.LOCKED:
      default:
        return {
          icon: this.lockIcon,
          class: 'locked',
        };
    }
  }

  round(val: number) {
    return Math.ceil(val);
  }

  handleLessonClick(material: IMaterialOverview) {
    if (material.status === MissionStatus.LOCKED) return;
    this.router.navigate([], { queryParams: { materialId: material.id } });
  }

  onNextMaterial(isNext: boolean) {
    const currentMaterialId = this.viewingMaterial?.id;
    if (!currentMaterialId) return;

    let nextLessonIndex = -1,
      nextMaterialId = null;

    const currentLesson = this.courseDetails.listLesson[this.currentLesson];
    const currentMaterialIndex = currentLesson.contents.findIndex(
      (m) => m.id === currentMaterialId
    );

    this.courseDetails.listLesson[this.currentLesson].contents[
      currentMaterialIndex
    ].status = MissionStatus.DONE;

    // Last material in lesson
    if (currentMaterialIndex === currentLesson.contents.length - 1) {
      const nextLesson = this.courseDetails.listLesson[this.currentLesson + 1];
      const nextMaterial = nextLesson?.contents[0];

      if (nextLesson && nextMaterial) {
        nextLessonIndex = nextLesson.index;
        nextMaterialId = nextMaterial.id;

        if (nextMaterial.status === MissionStatus.LOCKED) {
          this.courseDetails.listLesson[
            this.currentLesson + 1
          ].contents[0].status = MissionStatus.CURRENT;
        }
      } else {
        nextLessonIndex = -1;
        nextMaterialId = null;
      }
    } else {
      nextLessonIndex = currentLesson.index;
      nextMaterialId = currentLesson.contents[currentMaterialIndex + 1].id;

      if (
        currentLesson.contents[currentMaterialIndex + 1].status ===
        MissionStatus.LOCKED
      ) {
        currentLesson.contents[currentMaterialIndex + 1].status =
          MissionStatus.CURRENT;
      }
    }

    if ((nextLessonIndex === -1 || !nextMaterialId) && isNext) {
      this.viewingMaterial = null;
      this.router.navigate([]);

      if (!this.user.user$.value) return;

      const params: ICertificateReq = {
        CourseId: this.courseDetails.id,
        UserId: this.user.user$.value.id,
      };

      this.user.getCertificate(params).subscribe((res) => {
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.COMPLETED_COURSE')
        );
        if (res?.payload) {
          this.router.navigate(['/c', res.payload[0].id]);
        } else {
          this.router.navigate([]);
        }
      });
      return;
    }

    this.initMaterials();
    if (isNext) {
      this.currentLesson = nextLessonIndex;
      this.initMaterials();
      this.router.navigate([], { queryParams: { materialId: nextMaterialId } });
      setTimeout(() => {
        location.reload();
      }, 1);
    }
  }

  onRefund() {
    const userId = this.user.user$.value?.id;

    if (!this.courseDetails || !userId) return;
    if (Number(this.courseDetails.progress) > 20) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.CAN_NOT_REFUND')
      );
      return;
    }

    const transactionParam: ITransactionFilterParams = {
      UserId: userId,
      CourseId: this.courseDetails.id,
    };

    this.payment.filterTransaction(transactionParam).subscribe((res) => {
      if (!res?.payload || res?.payload?.length === 0) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.FAILED_TO_REFUND')
        );
        return;
      }

      this.payment
        .onRefund(res.payload[0].transactionId, this.courseDetails.id)
        .subscribe((res) => {
          if (!res?.payload) {
            this.message.addMessage(
              'error',
              this.translate.instant('MESSAGE.FAILED_TO_REFUND')
            );
            return;
          }

          this.message.addMessage(
            'success',
            this.translate.instant('MESSAGE.REFUNDED_SUCCESSFULLY')
          );
          this.router.navigate(['/']);
        });
    });
  }

  onHandleShardAndLevelAnimation(data: IShardAndLevel) {
    if (data.levelInfo) {
      this.fnQueue.push(() => {
        this.onHandleRewardLevel({
          expAdded: data.levelInfo.expAdded,
          newLevel: data.levelInfo.newLevel ?? (null as any),
          newLevelMaxExp:
            (data.levelInfo as any).newLevelMaxExp ?? (null as any),
        });
      });
    }

    if (data.addedItemShard) {
      this.fnQueue.push(() => {
        this.onHandleRewardShard(data.addedItemShard, data.itemShards);
      });
    }

    this.onHandleQueue();
  }

  onHandleRewardLevel({
    expAdded,
    newLevel,
    newLevelMaxExp,
  }: {
    expAdded: number;
    newLevel: number | null;
    newLevelMaxExp: number | null;
  }) {
    if (expAdded > 0) {
      setTimeout(() => {
        // this.isShowAddedExp = false;
        if (!this.userInfo) return;
        const newUInfo = cloneDeep(this.userInfo);
        newUInfo.statistic.exp = newLevel
          ? expAdded - newUInfo.statistic.maxExpLevel - newUInfo.statistic.exp
          : Number(newUInfo.statistic.exp) + expAdded;
        newUInfo.statistic.level =
          newLevel ?? (newUInfo.statistic.level as any);
        newUInfo.statistic.maxExpLevel =
          newLevelMaxExp ?? (newUInfo.statistic.maxExpLevel as any);

        this.user.updateUser(newUInfo);

        this.isShowAddedExp = true;
        this.addedExp = expAdded;
      }, 500);
    }
  }

  onHandleRewardShard(
    addedItemShard: number | null,
    allShards: { [key: string]: number }
  ) {
    if (addedItemShard) {
      this.isShowChest = true;
      this.addedShard = addedItemShard;
    }

    if (allShards && this.userInfo) {
      this.userInfo.itemShards = allShards;
      this.user.updateUser(this.userInfo);
    }
  }

  onGetShardName() {
    return (
      this.courseDetails.listTag.find((t) => t.type === 'Subject')?.name || ''
    );
  }

  onHandleQueue() {
    if (this.fnQueue.length > 0) {
      this.fnQueue.shift()?.();
    }
  }

  onHandleDoneExp() {
    this.isShowAddedExp = false;
    this.addedExp = 0;
    this.onHandleQueue();
  }

  onHandleDoneShard() {
    this.isShowChest = false;
    this.showRewardScreen = null;
    this.addedShard = 0;
    this.onHandleQueue();
  }

  onFinishChest() {
    this.isShowChest = false;
    this.showRewardScreen = 'shard';
  }
}
