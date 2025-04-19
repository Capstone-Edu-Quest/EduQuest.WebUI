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

@Component({
  selector: 'app-approve-instructor',
  templateUrl: './approve-instructor.component.html',
  styleUrl: './approve-instructor.component.scss',
})
export class ApproveInstructorComponent implements OnInit, AfterViewInit {
  @ViewChild('approval') approvalRef!: TemplateRef<any>;
  @ViewChild('instructorDetails') instructorDetailsRef!: TemplateRef<any>;

  isAppliedInsReady: boolean = false;
  appliedInstructorColumns: TableColumn[] = [];

  appliedInstructor: IInstructorApplyRes[] = [];
  currentViewInstructor: IInstructorApplyRes | null = null;

  acceptIcon = faCheck;
  rejectIcon = faClose;
  exploreIcon = faUpRightFromSquare;

  constructor(private modal: ModalService, private platform: PlatformService) {}

  ngOnInit(): void {
    this.initInstructorsList();
  }

  ngAfterViewInit(): void {
    this.appliedInstructorColumns = [
      {
        label: 'LABEL.ID',
        key: 'id',
      },
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

  onUpdateStatus(e: Event, row: IInstructorApplyRes, isAccept: boolean) {
    this.platform
      .onUpdateInstructorStatus(row.id, isAccept)
      .subscribe((res) => {
        console.log(res);
      });
  }
}
