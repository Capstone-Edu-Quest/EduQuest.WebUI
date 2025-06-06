import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
  IGetMyLearningPathParam,
  ILearningPath,
  ILearningPathDetails,
  IModifyLearningPath,
} from '../../shared/interfaces/learning-path.interfaces';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { onConvertObjectToQueryParams } from '../utils/data.utils';

@Injectable({
  providedIn: 'root',
})
export class LearningPathService {
  constructor(
    private http: HttpService,
    private message: MessageService,
    private translate: TranslateService,
    private router: Router
  ) {}

  myLearningPaths$: BehaviorSubject<ILearningPath[]> = new BehaviorSubject<
    ILearningPath[]
  >([]);

  initMyLearningPath() {
    this.getMyLearningPath().subscribe((res) => {
      if (!res?.payload) return;
      this.myLearningPaths$.next(res.payload);
    });
  }

  getMyLearningPath(param?: IGetMyLearningPathParam) {
    return this.http.get<ILearningPath[]>(
      endPoints.myLearningPath + onConvertObjectToQueryParams(param ?? {})
    );
  }

  getPublicLearningPath() {
    return this.http.get<ILearningPath[]>(endPoints.publicLearningPath);
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
          this.translate.instant('MESSAGE.CREATED_SUCCESSFULLY')
        );
      });
  }

  updateLearningPath(pathId: string, newPath: IModifyLearningPath) {
    return this.http
      .update<ILearningPathDetails>(
        endPoints.learningPath + `?learningPathId=${pathId}`,
        newPath
      )
      .pipe((res) => {
        res.subscribe((pipeRes) => {
          if (pipeRes?.payload) {
            const paths = this.myLearningPaths$.value;
            const index = paths.findIndex(
              (lp) => lp.id === pipeRes.payload?.id
            );
            if (index !== -1) {
              paths[index] = pipeRes.payload;
              this.myLearningPaths$.next(paths);
            }
          }
        });
        return res;
      });
  }

  modifyCoursesToLearningPath(
    pathId: string,
    courseIds: string[],
    action: 'add' | 'delete'
  ) {
    const isSuccess = new Subject();
    this.http
      .update<ILearningPath>(
        endPoints.learningPath + `?learningPathId=${pathId}`,
        {
          courses: courseIds.map((c) => ({
            courseId: c,
            action,
            courseOrder: -1,
          })),
        }
      )
      .subscribe((res) => {
        isSuccess.next(!!res?.payload);

        if (!res?.payload) return;

        const paths = [...this.myLearningPaths$.value];
        const pathIndex = paths.findIndex((p) => p.id === pathId);
        paths[pathIndex] = res.payload;

        this.myLearningPaths$.next(paths);

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.ADDED_SUCCESSFULLY')
        );
      });

    return isSuccess;
  }

  cloneLearningPath(pathId: string) {
    this.http
      .post<ILearningPath>(
        endPoints.duplicateLearningPath + `?learningPathId=${pathId}`,
        {}
      )
      .subscribe((res) => {
        if (!res?.payload) return;

        const paths = [...this.myLearningPaths$.value, res.payload];
        this.myLearningPaths$.next(paths);
        this.router.navigate(['learning-path', res.payload.id]);
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.CLONED_SUCCESSFULLY')
        );
      });
  }

  deleteLearningPath(pathId: string) {
    this.http
      .delete(endPoints.learningPath + `?learningPathId=${pathId}`)
      .subscribe((res) => {
        if (res?.isError) return;

        const paths = this.myLearningPaths$.value.filter(
          (p) => p.id !== pathId
        );
        this.myLearningPaths$.next(paths);

        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.DELETED_SUCCESSFULLY')
        );
        this.router.navigate(['learning-path']);
      });
  }

  onEnrollLearningPath(pathId: string) {
    const subject = new Subject();

    this.http
      .post(endPoints.enrollLearningPath + `?learningPathId=${pathId}`, {})
      .subscribe((res) => {
        if (!res?.payload) return;

        this.router.navigate(['learning-path', pathId]);
        subject.next(true);
        this.message.addMessage(
          'success',
          this.translate.instant('MESSAGE.ENROLLED_SUCCESSFULLY')
        );
      });

    return subject;
  }

  getLearningPathDetails(pathId: string) {
    return this.http.get<ILearningPathDetails>(
      endPoints.learningPathDetails + `?learningPathId=${pathId}`
    );
  }

  reEnrollLearningPath(pathId: string) {
    return this.http.post(
      endPoints.reEnrollLearningPath + `?learningPathId=${pathId}`,
      {}
    );
  }
}
