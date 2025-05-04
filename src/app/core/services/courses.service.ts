import { Injectable } from '@angular/core';
import {
  assignment,
  ICourse,
  ICourseApprovalStaff,
  ICourseCreate,
  ICourseInstructor,
  ICourseLearnerOverview,
  ICourseOverview,
  ILearningMaterial,
  IMarkAssignmentRequest,
  IMarkedAssignment,
  IMaterialResponse,
  IMyCourseChartsStats,
  IReview,
  IReviewParams,
  IReviewQuery,
  ISearchCourseParams,
  ISubmitAssignment,
  ISubmitQuizReq,
  ISubmittedQuestResponse,
  ITag,
  ITagRequestParam,
  IUnreviewAssignment,
  IUnreviewAssignmentResponse,
  materialType,
} from '../../shared/interfaces/course.interfaces';
import {
  faCirclePlay,
  faCode,
  faFile,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from './http.service';
import { endPoints } from 'src/app/shared/constants/endPoints.constant';
import { onConvertObjectToQueryParams } from '../utils/data.utils';
import { UserService } from './user.service';
import { BehaviorSubject } from 'rxjs';
import {
  InstructorCourseStatus,
  MaterialTypeEnum,
  TagTypeRequestEnum,
  TagTypeResponseEnum,
} from '../../shared/enums/course.enum';
import { Router } from '@angular/router';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { ICourseRevenueResponse } from '../../shared/interfaces/others.interfaces';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  myMaterials$: BehaviorSubject<IMaterialResponse | null> =
    new BehaviorSubject<IMaterialResponse | null>(null);

  constructor(
    private http: HttpService,
    private user: UserService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  onInitMyMaterials() {
    this.http.get<IMaterialResponse>(endPoints.material).subscribe((res) => {
      if (!res?.payload) {
        return;
      }

      this.myMaterials$.next(res.payload);
    });
  }

  onGetCourseOverviewStats() {
    return this.http.get<IMyCourseChartsStats>(endPoints.courseStatsOverview);
  }

  onGetInstructorCourseDetails(courseId: string) {
    return this.http.get<ICourseInstructor>(
      endPoints.courseDetaialsForInstructor + '?courseId=' + courseId
    );
  }

  onGetCourseCreatedByMe() {
    return this.http.get<ICourseOverview[]>(endPoints.getMyCourse);
  }

  onGetCourse(courseId: string) {
    const urlStr = endPoints.getCourseById + '?courseId=' + courseId;
    return this.http.get<ICourse>(urlStr);
  }

  onGetCourseReviews(query: IReviewQuery) {
    const queries = Object.keys(query).map(
      (key) => `${key}=${query[key as keyof IReviewQuery]}`
    );
    return this.http.get<IReview[]>(endPoints.review + '?' + queries.join('&'));
  }

  onSendCourseReview(param: IReviewParams) {
    return this.http.post<IReview>(
      endPoints.review + `?userId=${this.user.user$.value?.id}`,
      param
    );
  }

  onUpdateCourseReview(reviewId: string, param: IReviewParams) {
    return this.http.update<IReview>(
      endPoints.review + `?feedbackId=${reviewId}`,
      param
    );
  }

  onDeleteCourseReview(reviewId: string) {
    return this.http.delete<any>(
      endPoints.review +
        `?feedbackId=${reviewId}&userId=${this.user.user$.value?.id}`
    );
  }

  onGetMaterialIcon(materialType: materialType | MaterialTypeEnum) {
    switch (materialType) {
      case 'Video':
      case MaterialTypeEnum.VIDEO:
        return faCirclePlay;
      case 'Quiz':
      case MaterialTypeEnum.QUIZ:
        return faRocket;
      case 'Assignment':
      case MaterialTypeEnum.ASSIGNMENT:
        return faCode;
      case 'Document':
      case MaterialTypeEnum.DOCUMENT:
      default:
        return faFile;
    }
  }

  onGetCourseById(courseId: string) {
    const urlStr = endPoints.getCourseById + '?courseId=' + courseId;
    return this.http.get<ICourse>(urlStr);
  }

  onSearchCourse(params: ISearchCourseParams) {
    const urlStr =
      endPoints.searchCourse + onConvertObjectToQueryParams({ ...params });
    return this.http.get<ICourseOverview[]>(urlStr);
  }

  onGetStudyingCourses() {
    return this.http.get<ICourseOverview[]>(endPoints.getStudyingCourse);
  }

  onConvertDetailToOverview(course: ICourse) {
    const fields = [
      'id',
      'title',
      'description',
      'photoUrl',
      'author',
      'createdBy',
      'price',
      'discountPrice',
      'rating',
      'totalLesson',
      'totalTime',
      'totalReview',
      'progressPercentage',
    ];
    const courseOverview: any = {};

    fields.forEach((f) => {
      courseOverview[f] = course[f as keyof typeof course];
    });

    return courseOverview;
  }

  onGetMaterialType(type: MaterialTypeEnum) {
    switch (type) {
      case MaterialTypeEnum.VIDEO:
        return 'videos';
      case MaterialTypeEnum.ASSIGNMENT:
        return 'assignment';
      case MaterialTypeEnum.DOCUMENT:
        return 'document';
      case MaterialTypeEnum.QUIZ:
        return 'quiz';
      default:
        return '';
    }
  }

  createMaterial(data: ILearningMaterial) {
    this.http.post(endPoints.material, [data]).subscribe((res) => {
      if (!res?.payload) return;

      this.onInitMyMaterials();
      this.router.navigate(['materials', this.onGetMaterialType(data.type)]);
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY')
      );
    });
  }

  getMaterialById(materialId: string) {
    return this.http.get<ILearningMaterial>(
      endPoints.getMaterialDetails + `?materialId=${materialId}`
    );
  }

  deleteMaterial(materialId: string) {
    this.http
      .delete(endPoints.material + `?materialId=${materialId}`)
      .subscribe((res) => {
        if (!res?.payload) return;
        this.onInitMyMaterials();
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.DELETED_SUCCESSFULLY')
        );
      });
  }

  updateCourse(course: ICourseCreate) {
    this.http.update(endPoints.course, course).subscribe((res) => {
      if (!res?.payload) return;

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );
      this.router.navigate(['my-courses', course.courseId]);
    });
  }

  createCourse(course: ICourseCreate) {
    this.http
      .post<ICourseOverview>(endPoints.course, course)
      .subscribe((res) => {
        if (!res?.payload) return;

        this.router.navigate(['my-courses', res.payload.id]);
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY')
        );
      });
  }

  onAddTag(tag: { tagName: string; type: TagTypeRequestEnum }) {
    return this.http.post(endPoints.tag, tag);
  }

  onGetTags(param?: ITagRequestParam) {
    return this.http.get<ITag[]>(
      endPoints.searchTag + onConvertObjectToQueryParams(param ?? {})
    );
  }

  updateMaterial(data: ILearningMaterial) {
    this.http.update(endPoints.material, data).subscribe((res) => {
      if (!res?.payload) return;

      this.onInitMyMaterials();
      this.router.navigate(['materials', this.onGetMaterialType(data.type)]);
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );
    });
  }

  onGetMaterialDetailsById(id: string) {
    return this.http.get<ILearningMaterial>(
      endPoints.getMaterialDetails + `/materialId=${id}`
    );
  }

  onGetCourseByStatus(status: InstructorCourseStatus) {
    return this.http.get<ICourseApprovalStaff[]>(
      endPoints.getCourseByStatus + `?Status=${status}`
    );
  }

  onApprove(courseId: string, isApprove: boolean, rejectedReason: string) {
    return this.http.update(endPoints.approveCourse, { courseId, isApprove, rejectedReason });
  }

  onSubmitCourseForApproval(courseId: string) {
    return this.http.update(endPoints.submitCourse, { courseId });
  }

  onAssignCourseToExpert(courseId: string, expertId: string) {
    return this.http.update(endPoints.assignCourseToExpert, {
      courseId,
      assignTo: expertId,
    });
  }

  onGetCourseAssignedToMe() {
    return this.http.get<ICourseApprovalStaff[]>(
      endPoints.assignCourseToExpert
    );
  }

  onSubmitQuiz(data: ISubmitQuizReq, lessonId: string) {
    return this.http
      .post<ISubmittedQuestResponse>(
        endPoints.submitQuiz + `?lessonId=${lessonId}`,
        data
      )
      .pipe((res) => {
        if (res) {
          this.message.addMessage(
            'success',
            this.translate.instant('MESSAGE.SUBMITTED_SUCCESSFULLY')
          );
        }
        return res;
      });
  }

  onSubmitAssignment(data: ISubmitAssignment, lessonId: string) {
    return this.http
      .post<IMarkedAssignment>(
        endPoints.submitAssignment + `?lessonId=${lessonId}`,
        data
      )
      .pipe((res) => {
        if (res) {
          this.message.addMessage(
            'success',
            this.translate.instant('MESSAGE.SUBMITTED_SUCCESSFULLY')
          );
        }
        return res;
      });
  }

  onGetMyAssignment(assignmentId: string, lessonId: string) {
    return this.http.get<IMarkedAssignment>(
      endPoints.getAssignment +
        `?assignmentId=${assignmentId}&lessonId=${lessonId}`
    );
  }

  getCourseLearnersOverview(courseId: string) {
    return this.http.get<ICourseLearnerOverview[]>(
      endPoints.learnerOverview + `?courseId=${courseId}`
    );
  }

  getCourseLearnerDetails(courseId: string, userId: string) {
    return this.http.get(
      endPoints.learnerDetails +
        onConvertObjectToQueryParams({ courseId, userId })
    );
  }

  getUnreviewAssignment(courseId: string) {
    return this.http.get<IUnreviewAssignmentResponse>(
      endPoints.getUnreviewAssignment + `?courseId=${courseId}`
    );
  }

  markAssignment(param: IMarkAssignmentRequest) {
    return this.http.post(endPoints.markAssigment, param);
  }

  getMyCoursesRevenue() {
    return this.http.get<ICourseRevenueResponse[]>(endPoints.courseRevenue);
  }

  getMyCourseChartRevenue() {
    return this.http.get(endPoints.courseChartRevenue);
  }

  onGetTagTypeLabel(type: TagTypeRequestEnum | TagTypeResponseEnum) {
    switch (type) {
      case TagTypeRequestEnum.SUBJECT:
      case TagTypeResponseEnum.SUBJECT:
        return 'LABEL.SUBJECT';
      case TagTypeRequestEnum.LEVEL:
      case TagTypeResponseEnum.LEVEL:
        return 'LABEL.COURSE_LEVEL';

      default:
        return '';
    }
  }
}
