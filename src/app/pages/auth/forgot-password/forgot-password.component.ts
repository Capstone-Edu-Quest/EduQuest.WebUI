import { MessageService } from '@/src/app/core/services/message.service';
import { validateEmail } from '@/src/app/core/utils/string.utils';
import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  currentStep: number = 3;

  email: string = '';

  otp: string[] = new Array(6).fill(null);

  newPassword: string = '';
  confirmPassword: string = '';

  resendTime: number = 0;
  resendOTPInterval: any;

  constructor(
    private router: Router,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  backToSignIn() {
    this.router.navigate(['/signin']);
  }

  onContinue() {
    if (this.currentStep === 1) {
      if (!validateEmail(this.email)) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.INVALID_EMAIL')
        );
        return;
      }
      this.currentStep++;
      this.resendOTP();
    }

    if (this.currentStep === 2) {
      if (this.otp.some((otp) => otp === null)) {
        this.message.addMessage('error', this.translate.instant('MESSAGE.INVALID_OTP'));
        return;
      }

      this.currentStep++;
    }

    if (this.currentStep === 3) {
      if (this.newPassword !== this.confirmPassword) {
        this.message.addMessage('error', this.translate.instant('MESSAGE.PASSWORD_NOT_MATCH'));
        return;
      }
      
    }
  }

  onOtpChange(otp: string[]) {
    this.otp = otp;
  }

  resendOTP() {
    if (this.resendTime > 0) return;

    this.resendTime = 60;
    this.resendOTPInterval = setInterval(() => {
      this.resendTime--;
      if (this.resendTime <= 0) {
        clearInterval(this.resendOTPInterval);
      }
    }, 1000);
  }
}
