import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import { Component, OnInit } from '@angular/core';
import { defaultLanguage } from './shared/constants/languages.constant';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private ThemeService: ThemeService, translate: TranslateService) {
    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);
  }
  ngOnInit(): void {
    this.ThemeService.onInitTheme();
  }
}
