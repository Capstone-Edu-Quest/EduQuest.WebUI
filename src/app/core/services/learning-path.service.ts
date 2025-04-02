import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ILearningPath } from '../../shared/interfaces/learning-path.interfaces';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';

@Injectable({
  providedIn: 'root',
})
export class LearningPathService {
  constructor(private http: HttpService) {}

  // initMy() {
  //   this.http.get<ILearningPath[]>(endPoints.learningPath).subscribe((res) => {
  //     if (!res?.payload) return;
  //     this.myLearningPaths$.next(res.payload);
  //   });
  // }

  getMyLearningPath() {
    return this.http.get<ILearningPath[]>(endPoints.learningPath);
  }
}
