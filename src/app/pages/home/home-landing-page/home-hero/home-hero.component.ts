import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-hero',
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss'],
})
export class HomeHeroComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  onExploreMore() {
    window.scrollTo({
      top: window.scrollY + window.innerHeight - 30,
      behavior: 'smooth',
    });
  }
}
