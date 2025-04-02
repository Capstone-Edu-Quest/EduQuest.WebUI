import { Injectable } from '@angular/core';
import {
  ICourse,
  ICourseOverview,
  ISearchCourseParams,
  materialType,
} from '../../shared/interfaces/course.interfaces';
import {
  faChartBar,
  faCirclePlay,
  faCode,
  faFile,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';
import { HttpService } from './http.service';
import { endPoints } from 'src/app/shared/constants/endPoints.constant';
import { onConvertObjectToQueryParams } from '../utils/data.utils';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor(private http: HttpService) {}

  onGetCourse(courseId: string) {
    const urlStr = endPoints.getCourseById + '?courseId=' + courseId;
    return this.http.get<ICourse>(urlStr);
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
}
