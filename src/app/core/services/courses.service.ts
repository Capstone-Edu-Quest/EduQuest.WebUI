import { Injectable } from '@angular/core';
import {
  ICourse,
  ICourseInstructor,
  ICourseOverview,
  IMaterialResponse,
  IMyCourseChartsStats,
  IReview,
  IReviewQuery,
  ISearchCourseParams,
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

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  myMaterials$: BehaviorSubject<IMaterialResponse | null> = new BehaviorSubject<IMaterialResponse | null>(null)

  constructor(private http: HttpService, private user: UserService) {}

  onInitMyMaterials() {
    this.http.get<IMaterialResponse>(endPoints.material).subscribe(res => {
      if(!res?.payload) {
        return;
      }

      this.myMaterials$.next(res.payload)
    })
  }

  onGetCourseOverviewStats() {
    return this.http.get<IMyCourseChartsStats>(endPoints.courseStatsOverview)
  }

  onGetInstructorCourseDetails(courseId: string) {
    return this.http.get<ICourseInstructor>(endPoints.courseDetaialsForInstructor + '?courseId=' + courseId)
  }

  onGetCourseCreatedByMe() {
    return this.http.get<ICourseOverview[]>(endPoints.getMyCourse)
  }

  onGetCourse(courseId: string) {
    const urlStr = endPoints.getCourseById + '?courseId=' + courseId;
    return this.http.get<ICourse>(urlStr);
  }

  onGetCourseReviews(query: IReviewQuery) {
    const queries = Object.keys(query).map(key => `${key}=${query[key as keyof IReviewQuery]}`)
    return this.http.get<IReview[]>(endPoints.review + '?' + queries.join('&'))
  }

  onGetMaterialIcon(materialType: materialType) {
    switch (materialType) {
      case 'Video':
        return faCirclePlay;
      case 'Quiz':
        return faRocket;
      case 'Assignment':
        return faCode;
      case 'Document':
      default:
        return faFile;
    }
  }

  onGetCourseById(courseId: string) {
    const urlStr = endPoints.getCourseById + '/' + courseId;
    return this.http.get<ICourse>(urlStr);
  }

  onSearchCourse(params: ISearchCourseParams) {
    const urlStr =
      endPoints.searchCourse + onConvertObjectToQueryParams(params);
    return this.http.get<ICourseOverview[]>(urlStr);
  }

  onGetStudyingCourses() {
    return this.http.get<ICourseOverview[]>(endPoints.getStudyingCourse);
  }

  onConvertDetailToOverview(course: ICourse) {
    const fields = ["id", "title", "description", "photoUrl", "author", "createdBy", "price", "discountPrice", "rating", "totalLesson", "totalTime", "totalReview", "progressPercentage"]
    const courseOverview: any = {};

    fields.forEach(f => {
      courseOverview[f] = course[f as keyof typeof course]
    });

    return courseOverview
  }
}
