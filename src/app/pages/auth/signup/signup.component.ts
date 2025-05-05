import { Component, type OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
import { ISignUpReq } from '@/src/app/shared/interfaces/user.interfaces';
import { validateEmail } from '@/src/app/core/utils/string.utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signUpInfo: ISignUpReq = {
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  currentStep = 1;
  otp: string[] = new Array(6).fill(null);
  resendTime: number = 0;
  resendOTPInterval: any;

  googleIcon = faGoogle;

  constructor(
    private UserService: UserService,
    private router: Router,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  onSignInWithGoogle() {
    this.UserService.signInWithGoogle();
  }

  onBackToSignin() {
    this.router.navigate(['/signin']);
  }

  onContinue() {
    if (this.currentStep === 1) {
      if (
        this.signUpInfo.fullName === '' ||
        this.signUpInfo.email === '' ||
        this.signUpInfo.password === '' ||
        this.signUpInfo.confirmPassword === ''
      ) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.PLEASE_FILL_IN_ALL_FIELDS')
        );
        return;
      }

      if (!validateEmail(this.signUpInfo.email)) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.INVALID_EMAIL')
        );
        return;
      }

      if (this.signUpInfo.password !== this.signUpInfo.confirmPassword) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.PASSWORD_NOT_MATCH')
        );
        return;
      }

      this.resendOTP();
      return;
    }

    if (this.currentStep === 2) {
      if (this.otp.some((otp) => otp === null)) {
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.INVALID_OTP')
        );
        return;
      }

      this.UserService.validateSignupOtp({
        email: this.signUpInfo.email,
        otp: this.otp.join(''),
      });
      return;
    }
  }

  onOtpChange(otp: string[]) {
    this.otp = otp;
  }

  resendOTP() {
    if (this.resendTime > 0) return;

    this.UserService.onSignup(this.signUpInfo).subscribe((res) => {
      if (res?.isError) return;

      this.currentStep = 2;
      this.resendTime = 60;
      this.resendOTPInterval = setInterval(() => {
        this.resendTime--;
        if (this.resendTime <= 0) {
          clearInterval(this.resendOTPInterval);
        }
      }, 1000);
    });
  }
}
