import {
  Component,
  ViewChild,
  type OnInit,
  ElementRef,
  TemplateRef,
  AfterViewInit,
} from '@angular/core';
import { ICourse, ICourseApproval } from '../../../shared/interfaces/course.interfaces';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { Router } from '@angular/router';
import { faCheck, faClose, faPen } from '@fortawesome/free-solid-svg-icons';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';
import { UserService } from '../../../core/services/user.service';
import { Subscription } from 'rxjs';
import { WebRole } from '../../../shared/enums/user.enum';

@Component({
  selector: 'app-courses-approval',
  templateUrl: './courses-approval.component.html',
  styleUrl: './courses-approval.component.scss',
  animations: [fadeInOutAnimation],
})
export class CoursesApprovalComponent implements OnInit, AfterViewInit {
  @ViewChild('buttons') buttonsRef!: TemplateRef<any>;

  subscription$: Subscription = new Subscription();

  sampleCourses: ICourseApproval[] = [];

  courses: ICourse[] = [];

  tableColumns: TableColumn[] = [
    {
      key: 'name',
      label: 'LABEL.COURSE_NAME',
    },
    {
      key: 'description',
      label: 'LABEL.DESCRIPTION',
    },
    {
      key: 'instructor',
      label: 'LABEL.INSTRUCTOR',
      render: (c: ICourse) => c.author.username,
    },
    {
      key: 'price',
      label: 'LABEL.PRICE',
      isMoney: true,
    },
    {
      key: 'duration',
      label: 'LABEL.DURATION',
      translateLabel: 'SIGNATURE.HOURS',
    },
    {
      key: 'stageCount',
      label: 'LABEL.STAGES',
    },
  ];

  acceptIcon = faCheck;
  rejectIcon = faClose;
  editIcon = faPen;

  isStaffView: boolean = false;

  constructor(private router: Router, private user: UserService) {}

  ngOnInit(): void {
    this.listenToUser();
    this.initCourses();
  }

  ngAfterViewInit(): void {
    this.initTableAction();
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.isStaffView = user?.roleId === WebRole.STAFF;
      })
    );
  }

  initTableAction() {
    this.tableColumns.push({
      key: 'btns',
      label: this.isStaffView ? 'LABEL.ASSIGNED_EXERT' : '',
      elementRef: this.buttonsRef,
    });
  }

  initCourses(): void {
    this.courses = this.sampleCourses;

    console.log(this.courses);
    this.initTableData();
  }

  onViewDetails(course: ICourse): void {
    this.router.navigate(['/courses-manage/explore', course.id]);
    console.log(course);
  }

  onReject(e: Event, data: ICourse) {
    e.stopPropagation();
    console.log(data);
  }

  onAccept(e: Event, data: ICourse) {
    e.stopPropagation();
    console.log(data);
  }

  initTableData() {}

  onAssignExpert(e: Event, data: ICourse) {
    e.stopPropagation();
  }
}
