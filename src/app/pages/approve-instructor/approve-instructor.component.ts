import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
  type OnInit,
} from '@angular/core';
import {
  IInstructorApplyRes,
  TableColumn,
} from '../../shared/interfaces/others.interfaces';
import {
  faCheck,
  faClose,
  faUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '../../core/services/modal.service';
import { PlatformService } from '../../core/services/platform.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '../../core/services/message.service';

@Component({
  selector: 'app-approve-instructor',
  templateUrl: './approve-instructor.component.html',
  styleUrl: './approve-instructor.component.scss',
})
export class ApproveInstructorComponent implements OnInit, AfterViewInit {
  @ViewChild('approval') approvalRef!: TemplateRef<any>;
  @ViewChild('instructorDetails') instructorDetailsRef!: TemplateRef<any>;
  @ViewChild('rejectReason') rejectReasonRef!: TemplateRef<any>;

  isAppliedInsReady: boolean = false;
  appliedInstructorColumns: TableColumn[] = [];

  appliedInstructor: IInstructorApplyRes[] = [];
  currentViewInstructor: IInstructorApplyRes | null = null;

  rejectingInstructor: IInstructorApplyRes | null = null;
  inputRejectReason: string = '';

  acceptIcon = faCheck;
  rejectIcon = faClose;
  exploreIcon = faUpRightFromSquare;

  constructor(
    private modal: ModalService,
    private platform: PlatformService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initInstructorsList();
  }

  ngAfterViewInit(): void {
    this.appliedInstructorColumns = [
      {
        label: 'LABEL.NAME',
        key: 'username',
      },
      {
        label: 'LABEL.EMAIL',
        key: 'email',
      },
      {
        label: 'LABEL.PHONE',
        key: 'phone',
      },
      {
        label: 'LABEL.SUBJECT',
        key: 'subject',
        render: (value: IInstructorApplyRes) =>
          value.tags?.map((t) => t.tagName).join(', ') || '-',
      },
    ];

    this.appliedInstructorColumns.push({
      label: '',
      key: 'action',
      onClick: () => {},
      elementRef: this.approvalRef,
    });
  }

  initInstructorsList() {
    this.isAppliedInsReady = false;
    this.platform.getAssignedInstructorApplicantToMe().subscribe((res) => {
      this.appliedInstructor = res?.payload ?? [];
      this.isAppliedInsReady = true;
    });
  }

  viewCertificate(url: string) {
    window.open(url, '_blank');
  }

  onViewInstructorRegisterInfo(data: IInstructorApplyRes) {
    this.currentViewInstructor = data;
    this.modal.updateModalContent(this.instructorDetailsRef);
  }

  onReject(event: any, row: IInstructorApplyRes) {
    this.rejectingInstructor = row;
    this.inputRejectReason = '';
    this.modal.updateModalContent(this.rejectReasonRef);
  }

  onCancel() {
    this.rejectingInstructor = null;
    this.inputRejectReason = '';
    this.modal.updateModalContent(null);
  }

  onUpdateStatus(e: Event, row: IInstructorApplyRes | null, isAccept: boolean) {
    if (!row) return;

    if (!isAccept && !this.inputRejectReason.trim()) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.REJECT_NEED_REASON')
      );
      return;
    }

    this.platform
      .onUpdateInstructorStatus(row.id, isAccept, this.inputRejectReason)
      .subscribe((res) => {
        if (res?.isError) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.UPDATED_FAIL')
          );
          return;
        }

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
        );
        this.onCancel();
        this.initInstructorsList();
      });
  }
}
