import { Injectable } from '@angular/core';
import { IUser } from '../../shared/interfaces/UserInterfaces';
import { WebRole } from '../../shared/enums/user.enum';
import { BehaviorSubject } from 'rxjs';

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
  );

  constructor() {}

  updateUser(user: IUser | null) {
    this.user$.next(user);
  }
}
