import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient } from '@angular/common/http'; // Make sure HttpClient is imported here
import {
  AppDeclarations,
  NGIcons,
  appGuards,
  appServices,
} from './app.declarations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { PipesModule } from './core/pipes/pipes.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NgChartsModule } from 'ng2-charts';
import { NgxEditorModule } from 'ngx-editor';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { NgSelectModule } from '@ng-select/ng-select';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json'); // You may specify the path to your translation files
}
@NgModule({
  declarations: AppDeclarations,
  imports: [
    NgSelectModule,
    CodemirrorModule,
    NgxEditorModule,
    NgChartsModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    PipesModule,
    FormsModule,
    FontAwesomeModule,
    NzBadgeModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NzInputModule,
    NzIconModule.forRoot(NGIcons),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    HttpClient,
    provideAnimationsAsync(),
    ...appServices,
    ...appGuards,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
