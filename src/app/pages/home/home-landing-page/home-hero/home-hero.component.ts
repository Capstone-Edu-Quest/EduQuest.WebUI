import { UserService } from './../../../../core/services/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent implements OnInit {
  constructor(private UserService: UserService) {}

  ngOnInit() {}

  onExploreMore() {
    window.scrollTo({
      top: window.scrollY + window.innerHeight - 30,
      behavior: 'smooth',
    });
  }

  onSignIn() {
    this.UserService.signInWithGoogle();
  }
}
