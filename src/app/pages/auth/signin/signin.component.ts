import { Component, type OnInit } from '@angular/core';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { UserService } from 'src/app/core/services/user.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss',
})
export class SigninComponent implements OnInit {

  googleIcon = faGoogle;

  constructor(private UserService: UserService, private router: Router) {}

  ngOnInit(): void { }

  onSignInWithGoogle() {
    this.UserService.signInWithGoogle();
  }

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

}
