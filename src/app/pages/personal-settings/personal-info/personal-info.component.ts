import { MessageService } from '@/src/app/core/services/message.service';
import { UserService } from '@/src/app/core/services/user.service';
import { IChangeInfoReq } from '@/src/app/shared/interfaces/user.interfaces';
import { Component, type OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrl: './personal-info.component.scss',
})
export class PersonalInfoComponent implements OnInit {
  userInfo: IChangeInfoReq = {
    id: '',
    username: '',
    description: '',
    headline: '',
    phone: '',
  };

  constructor(
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.initUserInfo();
  }

  initUserInfo() {
    const userData = this.user.user$.value;
    if (!userData) return;

    this.userInfo = {
      id: userData.id,
      username: userData.username,
      description: userData.description ?? '',
      headline: userData.headline ?? '',
      phone: userData.phone,
    };
  }

  updateInfo() {
    const phoneRegex = /^[0-9]{9,15}$/; // simple validation
    if (!phoneRegex.test(this.userInfo.phone.trim())) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.ERROR_PHONE')
      );
      return;
    }

    if (this.userInfo.username.trim().length < 5) {
      this.message.addMessage(
        'error',
        this.translate.instant('MESSAGE.INVALID_NAME')
      );
      return;
    }
    
    this.user.updateUserInfo(this.userInfo);
  }
}
