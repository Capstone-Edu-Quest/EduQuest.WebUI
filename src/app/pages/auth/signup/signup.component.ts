import { Component, type OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  signUpInfo = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  currentStep = 2;
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
        this.signUpInfo.name === '' ||
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
      this.resendOTP();
      this.currentStep = 2;

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

      this.currentStep++;
      return;
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
