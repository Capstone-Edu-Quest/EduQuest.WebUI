import { Injectable } from '@angular/core';
import { IUser, IUserStat } from '../../shared/interfaces/UserInterfaces';
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

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user$: BehaviorSubject<IUser | null> =
    new BehaviorSubject<IUser | null>(null);

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private firebase: FirebaseService,
    private http: HttpService,
    private storage: StorageService
  ) {}

  updateUser(user: IUser | null) {
    this.user$.next(user);
    this.storage.setToLocalStorage(
      localStorageEnum.USER_DATA,
      JSON.stringify(user)
    );
  }

  initUser() {
    const userData = this.storage.getFromLocalStorage(
      localStorageEnum.USER_DATA
    );
    if (userData) {
      this.updateUser(JSON.parse(userData));
    }
  }

  signInWithGoogle() {
    this.firebase
      .signInWithPopupGoogle()
      .then((credential: UserCredential) => {
        const aToken = (credential.user as any).accessToken;

        this.http
          .post(endPoints.signin, { token: aToken })
          .subscribe((data) => {
            const payload = data.payload;
            this.updateUser({
              ...data.payload.userData,
              roleId: Number(data.payload.userData.roleId) as WebRole,
            });
            this.storage.setCookie(TokenEnum.ACCESS_TOKEN, payload.accessToken);
            this.storage.setCookie(
              TokenEnum.REFRESH_TOKEN,
              payload.refreshToken
            );

            this.message.addMessage(
              'success',
              this.translate.instant('MESSAGE.WELCOME_BACK', {
                name: data.payload.userData.username,
              })
            );
          });
      })
      .catch((err) => {
        this.http.handleError(err);
      });
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
}
