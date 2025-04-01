import { Component, type OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/core/services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from '@/src/app/core/services/message.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-manage-password',
  templateUrl: './manage-password.component.html',
  styleUrl: './manage-password.component.scss',
})
export class ManagePasswordComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  oldPassword = '';
  password = '';
  confirmPassword = '';

  email = '';

  resendTime: number = 0;
  resendOTPInterval: any;

  otp: string[] = new Array(6).fill(null);

  currentStep = 1;

  constructor(
    private userService: UserService,
    private translate: TranslateService,
    private message: MessageService
  ) {}

  ngOnInit(): void {
    this.listenUser();
  }

  listenUser() {
    this.subscription.add(
      this.userService.user$.subscribe((user) => {
        this.email = user?.email ?? '';
      })
    );
  }

  onConfirm() {
    if (this.currentStep === 1) {
      if (this.password !== this.confirmPassword) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.PASSWORDS_DO_NOT_MATCH')
        );
        return;
      }

      const changePassword$ = this.userService.changePassword(
        this.oldPassword,
        this.password
      );
      if (!changePassword$) return;

      changePassword$.subscribe((res) => {
        if (!res?.isError) {
          this.message.addMessage(
            'success',
            this.translate.instant(
              'MESSAGE.' + (res?.message?.content ?? ''),
              res?.message?.values ?? {}
            )
          );
          this.resendTime = 60;
          this.currentStep = 2;
        }
      });
    }

    if (this.currentStep === 2) {
      const validateOtp$ = this.userService.validateOtp(
        this.email,
        this.otp.join(''),
        true
      );
      if (!validateOtp$) return;

      validateOtp$.subscribe((res) => {
        if (!res?.isError) {
          this.message.addMessage(
            'success',
            this.translate.instant(
              'MESSAGE.' + (res?.message?.content ?? ''),
              res?.message?.values ?? {}
            )
          );
          this.currentStep = 3;
        }
      });
    }
  }

  onOtpChange(otp: string[]) {
    this.otp = otp;
  }

  resendOTP() {
    if (this.resendTime > 0) return;

    const changePassword$ = this.userService.changePassword(
      this.oldPassword,
      this.password
    );

    if (!changePassword$) return;

    changePassword$.subscribe((res) => {
      this.message.addMessage(
        'success',
        this.translate.instant('MESSAGE.' + res?.message?.content)
      );
      this.resendTime = 60;
      this.resendOTPInterval = setInterval(() => {
        this.resendTime--;
        if (this.resendTime <= 0) {
          clearInterval(this.resendOTPInterval);
        }
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
