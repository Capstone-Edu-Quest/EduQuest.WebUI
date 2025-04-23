import { CoursesService } from '@/src/app/core/services/courses.service';
import { MessageService } from '@/src/app/core/services/message.service';
import {
  IFlattedUnreviewAssignment,
  IMarkAssignmentRequest,
  IUnreviewAssignmentResponse,
} from '@/src/app/shared/interfaces/course.interfaces';
import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-courses-details-unmark-assi',
  templateUrl: './my-courses-details-unmark-assi.component.html',
  styleUrl: './my-courses-details-unmark-assi.component.scss',
})
export class MyCoursesDetailsUnmarkAssiComponent implements OnInit {
  leftIcon = faAngleLeft;
  rightIcon = faAngleRight;

  viewingAssignmentNumber: number = 0;
  viewingAssignment: IFlattedUnreviewAssignment | null = null;
  mark: number = 0;
  comment: string = '';

  unreviewAssignment: IUnreviewAssignmentResponse | null = null;
  flattedAssignments: IFlattedUnreviewAssignment[] = [];

  constructor(
    private course: CoursesService,
    private route: ActivatedRoute,
    private message: MessageService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    this.initAssignments();
  }

  initAssignments() {
    const courseId = this.route.snapshot.paramMap.get('courseId');
    this.viewingAssignmentNumber = 0;
    this.flattedAssignments = [];
    this.mark = 0;
    if (!courseId) return;
    this.course.getUnreviewAssignment(courseId).subscribe((res) => {
      this.unreviewAssignment = res?.payload ?? null;

      if (this.unreviewAssignment) {
        this.unreviewAssignment.assignments.forEach((_l) => {
          const { attempts, ...others } = _l;
          attempts.forEach((_a) => {
            this.flattedAssignments.push({ ...others, attemptInfo: _a });
          });
        });

        this.viewingAssignment = this.flattedAssignments[0] ?? null;
      }
    });
  }

  onMark() {
    if (!this.viewingAssignment) return;

    if (this.mark < 0 || this.mark > 10) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_MARK')
      );
      return;
    }

    const param: IMarkAssignmentRequest = {
      assignmentAttemptId: this.viewingAssignment.attemptInfo.id,
      grade: this.mark,
      comment: this.comment,
    };

    this.course.markAssignment(param).subscribe((res) => {
      if (res?.isError) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.FAILED_TO_MARK')
        );
        return;
      }

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.MARK_SUCCESS')
      );

      this.flattedAssignments = this.flattedAssignments.filter(
        (a) => a.attemptInfo.id !== param.assignmentAttemptId
      );
      this.viewingAssignmentNumber = 0;
      this.viewingAssignment = this.flattedAssignments[this.viewingAssignmentNumber]
    });
  }

  onChangeOrder(addValue: number) {
    this.viewingAssignmentNumber += addValue;
    this.viewingAssignment =
      this.flattedAssignments[this.viewingAssignmentNumber];
    this.mark = 0;
    this.comment = '';
  }
}
