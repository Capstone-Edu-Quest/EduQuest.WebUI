import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { defaultLanguage } from './shared/constants/languages.constant';
import { ModalService } from './core/services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private ThemeService: ThemeService,
    private translate: TranslateService,
    public modal: ModalService
  ) {
    translate.setDefaultLang(defaultLanguage);
    translate.use(defaultLanguage);
  }

  ngOnInit(): void {
    this.ThemeService.onInitTheme();
  }
}
