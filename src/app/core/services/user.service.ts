import { Injectable } from '@angular/core';
import { IUser } from '../../shared/interfaces/UserInterfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

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
  };

  user$: BehaviorSubject<IUser | null> = new BehaviorSubject<IUser | null>(
    this.demoUser
    // null
  );

  constructor(
    private message: MessageService,
    private translate: TranslateService,
    private router: Router
  ) {}

  updateUser(user: IUser | null) {
    this.user$.next(user);
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
