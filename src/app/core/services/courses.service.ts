import { Injectable } from '@angular/core';
import { materialType } from '../../shared/interfaces/course.interfaces';
import {
  faChartBar,
  faCirclePlay,
  faCode,
  faFile,
  faRocket,
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  constructor() {}

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
}
