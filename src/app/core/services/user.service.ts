import { Injectable, Injector } from '@angular/core';
import {
  IChangeInfoReq,
  IGetUserByRoleId,
  ILoginRes,
  IProfile,
  ISearchUserReq,
  ISearchUserRes,
  ISignUpReq,
  IUser,
} from '../../shared/interfaces/user.interfaces';
import { UserStatusEnum, WebRole } from '../../shared/enums/user.enum';
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
import {
  AdminDashboardResponse,
  ICertificateReq,
  ICertificateRes,
  IPackageConfig,
} from '../../shared/interfaces/others.interfaces';
import { onConvertObjectToQueryParams } from '../utils/data.utils';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    null
  );
  equippedItems$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([])

  adminDashboard$: BehaviorSubject<AdminDashboardResponse | null> =
    new BehaviorSubject<AdminDashboardResponse | null>(null);

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

  reloadMyData() {
    this.http.get<IUser>(endPoints.getMyInfo).subscribe((res) => {
      if (!res?.payload) {
        this.logout();
        return;
      }

      if (res.payload.status === UserStatusEnum.BLOCKED) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.SUSPENDED_ACCOUNT')
        );
        this.logout();
        return;
      }
      this.updateUser({ ...res.payload, roleId: Number(res.payload.roleId) });
    });
  }

  updateUser(user: IUser | null, isQuietSync?: boolean) {
    !isQuietSync && this.user$.next(user);
    
    this.equippedItems$.next(user?.equippedItems ?? [])
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
    }

    this.reloadMyData();
  }

  getSubscriptions() {
    return this.http.get<IPackageConfig[]>(endPoints.subscription);
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

  signInWithPassword(email: string, password: string) {
    this.http
      .post<ILoginRes>(endPoints.signInPassword, { email, password })
      .subscribe((res) => this.signInHandler(res));
  }

  forgetPassword(email: string) {
    return this.http
      .post<ILoginRes>(endPoints.resetPassword, { email })
      .pipe((res) => {
        return res;
      });
  }

  changePassword(oldPassword: string, newPassword: string) {
    if (!this.user$.value) return;

    return this.http
      .post<ILoginRes>(endPoints.changePassword, {
        email: this.user$.value?.email,
        oldPassword,
        newPassword,
      })
      .pipe((res) => res);
  }

  // resendOtp(email: string) {
  //   return this.http
  //     .post<ILoginRes>(endPoints.otp, { email })
  //     .pipe((res) => {
  //       return res;
  //     })
  // }

  validateOtp(email: string, otp: string, isChangePassword: boolean = false) {
    return this.http
      .post<ILoginRes>(endPoints.validateOtp, { email, otp, isChangePassword })
      .pipe((res) => res);
  }

  private signInHandler(response: BaseReponse<ILoginRes> | undefined) {
    const payload = response?.payload;
    if (!payload) return;

    if (payload.userData.status === UserStatusEnum.BLOCKED) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.SUSPENDED_ACCOUNT')
      );
      return;
    }

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
    this.router.navigate(['/']);
    location.reload();
  }

  logout() {
    this.updateUser(null);
    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.LOG_OUT_SUCCESS')
    );
    this.storage.setToLocalStorage(localStorageEnum.USER_DATA, null);
    this.router.navigate(['/']);
    this.storage.setCookie(TokenEnum.ACCESS_TOKEN, null);
    this.storage.setCookie(TokenEnum.REFRESH_TOKEN, null);
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

  getUserProfile(userId: string) {
    return this.http.get<IProfile>(endPoints.getProfile + `?userId=${userId}`);
  }

  getAdminDashboard() {
    return this.http.get<AdminDashboardResponse>(endPoints.adminHome);
  }

  initAdminDashboards() {
    this.getAdminDashboard().subscribe((res) => {
      this.adminDashboard$.next(res?.payload ?? null);
    });
  }

  getUserByRoleId(roleId: WebRole) {
    return this.http.get<IGetUserByRoleId[]>(
      endPoints.getUserByRoleId + `?roleId=${roleId}`
    );
  }

  updateUserLearningProgress(
    materialId: string,
    lessonId: string,
    time: number | null
  ) {
    return this.http.update(endPoints.userProgress, {
      materialId,
      lessonId,
      time,
    });
  }

  equipItem(itemsName: string[]) {
    const currentUser = this.user$.value;
    if (!currentUser) return;

    return this.http
      .post(endPoints.equipItem, { items: itemsName })
      .subscribe((res) => {
        if (!res) {
          this.message.addMessage(
            'error',
            this.translate.instant('MESSAGE.EQUIPED_FAILED')
          );
        } else {
          currentUser.equippedItems = itemsName;
          this.updateUser(currentUser, true);
        }

        return res;
      });
  }

  onSwitchUserRole(data: { userId: string; roleId: WebRole }) {
    return this.http.update(endPoints.switchRole, data);
  }

  getCertificate(param: ICertificateReq) {
    const params = onConvertObjectToQueryParams(param);
    return this.http.get<ICertificateRes[]>(
      endPoints.searchCertificate + params
    );
  }

  updateUserInfo(newInfo: IChangeInfoReq) {
    this.http.update<IUser>(endPoints.user, newInfo).subscribe((res) => {
      if (!res?.payload) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.UPDATED_FAIL')
        );
        return;
      }

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.UPDATED_SUCCESSFULLY')
      );

      if (!this.user$.value) return;
      const { username, headline, description, phone } = res.payload;
      this.updateUser({
        ...this.user$.value,
        username,
        headline,
        description,
        phone,
      });
    });
  }

  onSignup(param: ISignUpReq) {
    return this.http.post(endPoints.signUp, param);
  }

  validateSignupOtp({ email, otp }: { email: string; otp: string }) {
    this.http.post(endPoints.optSignUp, { email, otp }).subscribe((res) => {
      if (!res?.payload) return;

      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.CREATE_ACCOUNT_SUCCESSFULLY')
      );
      this.router.navigate(['/signin']);
    });
  }

  onSearchUser(param: ISearchUserReq) {
    return this.http.get<ISearchUserRes[]>(
      endPoints.searchUser + onConvertObjectToQueryParams(param)
    );
  }

  updateUserStatus(data: { userId: string; status: UserStatusEnum }) {
    return this.http.update(endPoints.updateStatus, data);
  }
}
