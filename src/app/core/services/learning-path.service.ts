import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  ILearningPath,
  IModifyLearningPath,
} from '../../shared/interfaces/learning-path.interfaces';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LearningPathService {
  constructor(
    private http: HttpService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  myLearningPaths$: BehaviorSubject<ILearningPath[]> = new BehaviorSubject<
    ILearningPath[]
  >([]);

  initMyLearningPath() {
    this.http
      .get<ILearningPath[]>(endPoints.myLearningPath)
      .subscribe((res) => {
        if (!res?.payload) return;
        this.myLearningPaths$.next(res.payload);
      });
  }

  getPublicLearningPath() {
    return this.http
    .get<ILearningPath[]>(endPoints.publicLearningPath)
  }

  addNewLearningPath(learningPathInfo: IModifyLearningPath) {
    this.http
      .post<ILearningPath>(endPoints.learningPath, learningPathInfo)
      .subscribe((res) => {
        if (!res?.payload) return;

        this.myLearningPaths$.next([
          ...this.myLearningPaths$.value,
          res.payload,
        ]);
        this.message.addMessage(
          'success',
          this.translate.instant(
            res.message?.content ?? '',
            res.message?.values ?? {}
          )
        );
      });
  }

  modifyCoursesToLearningPath(
    pathId: string,
    courseIds: string[],
    action: 'add' | 'delete'
  ) {
    this.http
      .update(
        endPoints.learningPath,
        courseIds.map((c) => ({ courseId: c, action, courseOrder: -1 })),
        pathId
      )
      .subscribe((res) => console.log(res));
  }
}
