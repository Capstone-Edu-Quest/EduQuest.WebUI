import { Injectable, Injector } from '@angular/core';
import { ILoginRes, IUser } from '../../shared/interfaces/user.interfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { HttpService } from './http.service';
import { UserCredential } from 'firebase/auth';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { StorageService } from './storage.service';
import {
  TokenEnum,
  localStorageEnum,
} from '../../shared/enums/localStorage.enum';
import { BaseReponse } from '../../shared/interfaces/https.interfaces';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    null
  );
  private firebase!: FirebaseService;

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private injector: Injector,
    private http: HttpService,
    private storage: StorageService,
    private loading: LoadingService
  ) {}

  initFirebase() {
    this.firebase = this.injector.get(FirebaseService);
  }

  updateUser(user: IUser | null) {
    this.user$.next(user);
    this.storage.setToLocalStorage(
      localStorageEnum.USER_DATA,
      JSON.stringify(user)
    );
  }

  initUser() {
    this.initFirebase();
    const userData = this.storage.getFromLocalStorage(
      localStorageEnum.USER_DATA
    );

    if (userData) {
      this.updateUser(JSON.parse(userData));

      if (JSON.parse(userData).roleId !== WebRole.INSTRUCTOR) return;

      setTimeout(() => {
        this.firebase.removeCachedImage();
      }, 1000);
    }
  }

  getUserById(uid: string) {
    return {
      id: 'u1',
      username: 'david_teacher',
      email: 'david@example.com',
      phone: '+1234567890',
      avatarUrl: 'https://example.com/avatars/david.png',
      roleId: WebRole.LEARNER,
      isPremium: true,
      status: 'active',
      statistic: {
        userId: 'u1',
        totalActiveDay: 180,
        maxStudyStreakDay: 45,
        lastLearningDay: '2025-03-02',
        completedCourses: 15,
        gold: 7000,
        exp: 18000,
        level: 18,
        studyTime: 360, // hours
        totalCourseCreated: 8,
        totalLearner: 1500,
        totalReview: 300,
      },
      lastActive: '2025-03-03T12:00:00Z',
      mascotItem: ['wings', 'katana'],
    };
  }

  signInWithGoogle() {
    this.loading.addLoading();
    this.firebase
      .signInWithPopupGoogle()
      .then((credential: UserCredential) => {
        const aToken = (credential.user as any).accessToken;

        this.http
          .post<ILoginRes>(endPoints.signin, { token: aToken })
          .subscribe((res) => this.signInHandler(res));
      })
      .catch((err) => {
        this.http.handleHttpError(err);
      })
      .finally(() => this.loading.removeLoading());
  }

  private signInHandler(response: BaseReponse<ILoginRes>) {
    const payload = response.payload;
    if (!payload) return;

    this.updateUser({
      ...payload.userData,
      roleId: Number(payload.userData.roleId) as WebRole,
    });
    this.storage.setCookie(TokenEnum.ACCESS_TOKEN, payload.token.accessToken);
    this.storage.setCookie(TokenEnum.REFRESH_TOKEN, payload.token.refreshToken);

    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.WELCOME_BACK', {
        name: payload.userData.username,
      })
    );
  }

  logout() {
    this.updateUser(null);
    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.LOG_OUT_SUCCESS')
    );
    this.storage.setToLocalStorage(localStorageEnum.USER_DATA, null);
    this.router.navigate(['/']);
  }

  getRoleLabel(role: WebRole) {
    switch (role) {
      case WebRole.ADMIN:
        return 'LABEL.ADMIN';
      case WebRole.INSTRUCTOR:
        return 'LABEL.INSTRUCTOR';
      case WebRole.LEARNER:
        return 'LABEL.LEARNER';
      case WebRole.EXPERT:
        return 'LABEL.EXPERT';
      case WebRole.STAFF:
        return 'LABEL.STAFF';
      default:
        return '';
    }
  }
}
