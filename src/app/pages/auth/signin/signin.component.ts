import { Component, type OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
import { validateEmail } from '@/src/app/core/utils/string.utils';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {

  googleIcon = faGoogle;
  email: string = '';
  password: string = '';

  constructor(private UserService: UserService, private router: Router, private message: MessageService, private translate: TranslateService) {}

  ngOnInit(): void { }

  onSignIn() {
    if(!validateEmail(this.email)) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.INVALID_EMAIL'));
      return;
    }

    if(!this.password) {
      this.message.addMessage('error', this.translate.instant('MESSAGE.PASSWORD_REQUIRED'));
      return;
    }

    this.UserService.signInWithPassword(this.email, this.password);
  }

  onSignInWithGoogle() {
    this.UserService.signInWithGoogle();
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onSignUp() {
    this.router.navigate(['/signup']);
  }

}
