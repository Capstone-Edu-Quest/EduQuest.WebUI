import { Component, ViewChild, type OnInit, TemplateRef } from '@angular/core';
import { TableColumn } from '../../../shared/interfaces/others.interfaces';
import { ViolationsService } from '../../../core/services/violations.service';
import {
  IReportFeedback,
  IReportedCourse,
  IViolation,
  IViolationCount,
  IViolationUser,
} from '../../../shared/interfaces/violations.interface';
import {
  ViolationActionEnum,
  ViolationsStatusEnum,
  ViolationsTypeEnum,
} from '../../../shared/enums/violations.enum';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-violations-list',
  templateUrl: './violations-list.component.html',
  styleUrl: './violations-list.component.scss',
})
export class ViolationsListComponent implements OnInit {
  @ViewChild('violationDetails') detailsTemplate!: TemplateRef<any>;

  currentViewViolation: IViolation | null = null;

  violationTableColumns: TableColumn[] = [
    {
      label: 'LABEL.ID',
      key: 'id',
    },
    {
      label: 'LABEL.REPORTER',
      key: 'reporter',
      render: (data: IViolation) => data.reporter.name,
    },
    {
      label: 'LABEL.VIOLATOR',
      key: 'violator',
      render: (data: IViolation) => data.violator.name,
    },
    {
      label: 'LABEL.TYPE',
      key: 'type',
      translateLabel: (data: IViolation) =>
        this.violation.onGetTypeLabel(data.type),
    },
    {
      label: 'LABEL.REASON',
      key: 'reason',
    },
    {
      label: 'LABEL.STATUS',
      key: 'status',
      translateLabel: (data: IViolation) =>
        this.violation.onGetStatusLabel(data.status),
    },
  ];
  violations: IViolation[] = [
    {
      id: 'v1',
      reporter: {
        id: 'u101',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
      },
      violator: {
        id: 'u102',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1987654321',
      },
      type: ViolationsTypeEnum.USER,
      reason: 'User is spamming links in course discussions.',
      reportedObject: {
        id: 'c301',
        name: 'Introduction to AI',
      } as IReportedCourse,
      status: ViolationsStatusEnum.PENDING,
    },
    {
      id: 'v2',
      reporter: {
        id: 'u103',
        name: 'David Smith',
        email: 'david@example.com',
        phone: '+1122334455',
      },
      violator: {
        id: 'u104',
        name: 'Sarah Connor',
        email: 'sarahconnor@example.com',
        phone: '+1555666777',
      },
      type: ViolationsTypeEnum.FEEDBACK,
      reason: 'Feedback contains offensive language.',
      reportedObject: {
        id: 'f201',
        rating: 1,
        content: 'This course is absolutely useless and full of garbage!',
      } as IReportFeedback,
      status: ViolationsStatusEnum.PENDING,
    },
    {
      id: 'v3',
      reporter: {
        id: 'u105',
        name: 'Emily Brown',
        email: 'emily@example.com',
        phone: '+1444555666',
      },
      violator: {
        id: 'u106',
        name: 'Michael Scott',
        email: 'michael@example.com',
        phone: '+1666777888',
      },
      type: ViolationsTypeEnum.USER,
      reason: 'User is sending inappropriate messages to other students.',
      reportedObject: null,
      status: ViolationsStatusEnum.PENDING,
    },
  ];

  auditLogColumns: TableColumn[] = [
    {
      label: 'LABEL.TIME',
      key: 'time',
      render: (data: IViolation) =>
        data.repsonse ? new Date(data.repsonse.time).toLocaleString() : '-',
    },
    ...this.violationTableColumns,
    {
      label: 'LABEL.ACTION',
      key: 'response',
      translateLabel: (data: IViolation) =>
        this.violation.onGetActionLabel(data.repsonse?.action),
    },
  ];
  auditLogs: IViolation[] = [
    {
      id: 'v1',
      reporter: {
        id: 'u101',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        phone: '+1234567890',
      },
      violator: {
        id: 'u102',
        name: 'John Doe',
        email: 'johndoe@example.com',
        phone: '+1987654321',
      },
      repsonse: {
        time: new Date().toUTCString(),
        comment: 'Action can not be confirm',
        action: null,
      },
      type: ViolationsTypeEnum.USER,
      reason: 'User is spamming links in course discussions.',
      reportedObject: {
        id: 'c301',
        name: 'Introduction to AI',
      } as IReportedCourse,
      status: ViolationsStatusEnum.REJECTED,
    },
    {
      id: 'v2',
      reporter: {
        id: 'u103',
        name: 'David Smith',
        email: 'david@example.com',
        phone: '+1122334455',
      },
      violator: {
        id: 'u104',
        name: 'Sarah Connor',
        email: 'sarahconnor@example.com',
        phone: '+1555666777',
      },
      repsonse: {
        time: new Date().toUTCString(),
        comment: 'User has been warned. Feedback has been deleted.',
        action: ViolationActionEnum.WARN_DELETE,
      },
      type: ViolationsTypeEnum.FEEDBACK,
      reason: 'Feedback contains offensive language.',
      reportedObject: {
        id: 'f201',
        rating: 1,
        content: 'This course is absolutely useless and full of garbage!',
      } as IReportFeedback,
      status: ViolationsStatusEnum.RESOLVED,
    },
    {
      id: 'v3',
      reporter: {
        id: 'u105',
        name: 'Emily Brown',
        email: 'emily@example.com',
        phone: '+1444555666',
      },
      violator: {
        id: 'u106',
        name: 'Michael Scott',
        email: 'michael@example.com',
        phone: '+1666777888',
      },
      type: ViolationsTypeEnum.USER,
      reason: 'User is sending inappropriate messages to other students.',
      reportedObject: null,
      repsonse: {
        time: new Date().toUTCString(),
        comment: 'User has been warned',
        action: ViolationActionEnum.WARN,
      },
      status: ViolationsStatusEnum.RESOLVED,
    },
  ];

  violationCountsTableColumns: TableColumn[] = [
    {
      label: 'LABEL.ID',
      key: 'id'
    },
    {
      label: 'LABEL.NAME',
      key: 'name',
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
      label: 'LABEL.NUMBER_OF_VIOLATED',
      key: 'numberOfViolated',
    },
  ]
  violationCounts: IViolationCount[] = [
    {
      id: 'vc1',
      numberOfViolated: 8,
      name: 'John Doe',
      email: 'johndoe@example.com',
      phone: '+1234567890',
    },
    {
      id: 'vc2',
      numberOfViolated: 6,
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phone: '+1987654321',
    },
    {
      id: 'vc3',
      numberOfViolated: 5,
      name: 'Bob Williams',
      email: 'bobw@example.com',
      phone: '+1765432987',
    },
    {
      id: 'vc4',
      numberOfViolated: 2,
      name: 'Emily Davis',
      email: 'emilyd@example.com',
      phone: '+1654321876',
    },
  ];

  constructor(private violation: ViolationsService, private modal: ModalService) {}

  ngOnInit(): void {}

  onViewReportDetails(data: IViolation): void {
    this.currentViewViolation = data;
    this.modal.updateModalContent(this.detailsTemplate);
  }

  onViewViolationLogs(data: IViolationCount) {
    console.log('Viewing violation logs:', data);
  }
}
