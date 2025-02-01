import { Injectable } from '@angular/core';
import { IUser } from '../../shared/interfaces/UserInterfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { HttpService } from './http.service';
import { UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  demoUser: IUser = {
    id: '123456',
    name: 'Truong Nguyen Gia Khang',
    email: 'khangtngse171927@fpt.edu.vn',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Khang',
    role: WebRole.LEANER,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    jobTitle: 'Software Engineer',
    description: 'A software engineer who loves to learn new things',
    statistics: [
      { label: 'LABEL.TOTAL_COURSES_STATS', value: 12 },
      { label: 'LABEL.TOTAL_LEARNER_STATS', value: 1253 },
      { label: 'LABEL.TOTAL_REVIEWS_STATS', value: 152 },
      { label: 'LABEL.AVERAGE_RATINGS_STATS', value: 4.8 },
    ],
  };

  user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    this.demoUser
    // null
  );

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private router: Router,
    private firebase: FirebaseService,
    private http: HttpService
  ) {}

  updateUser(user: IUser | null) {
    this.user$.next(user);
  }

  signInWithGoogle() {
    this.firebase
      .signInWithPopupGoogle()
      .then((credential: UserCredential) => {
        console.log(credential.user);
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
    this.router.navigate(['/']);
  }
}
