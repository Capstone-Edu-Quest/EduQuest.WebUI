import { Injectable } from '@angular/core';
import { ICourse, ICourseOverview, ISearchCourseParams, materialType } from '../../shared/interfaces/course.interfaces';
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

  onGetCourse(courseId: string) {}

  onGetMaterialIcon(materialType: materialType) {
    switch (materialType) {
      case 'video':
        return faCirclePlay;
      case 'quiz':
        return faRocket;
      case 'assignment':
        return faCode;
      case 'document':
      default:
        return faFile;
    }
  }

  onConvertCourseDetailsToCourseOverview(course: ICourse): ICourseOverview {
    const courseOverview: ICourseOverview = {
      id: course.id,
      title: course.name,
      author: course.author.name,
      photoUrl: course.image,
      price: course.price,
      discountPrice: 0,
      rating: course.rating,
      totalReview: course.numberOfRating,
      totalLesson: course.stageCount ?? 0,
      totalTime: course.duration,
      progress: course.progress,
      description: course.description,
      createdBy: course.author.name,
    };
    
    return courseOverview;
  }

  onSearchCourse(params: ISearchCourseParams) {
    const urlStr = endPoints.searchCourse + onConvertObjectToQueryParams(params);
    return this.http.get<ICourseOverview[]>(urlStr)
  }
}
