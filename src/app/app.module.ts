import { NzInputModule } from 'ng-zorro-antd/input';
import {NzBadgeModule} from 'ng-zorro-antd/badge';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient } from '@angular/common/http'; // Make sure HttpClient is imported here
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { AppDeclarations, NGIcons } from './app.declarations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StoreModule } from '@ngrx/store';
import { currencyReducer } from './core/state/currency/currency.reducer';
import { PipesModule } from './core/pipes/pipes.module';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json'); // You may specify the path to your translation files
}

@NgModule({
  declarations: AppDeclarations,
  imports: [
    PipesModule,
    FontAwesomeModule,
    NzBadgeModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NzInputModule,
    StoreModule.forRoot({
      currency: currencyReducer
    }),
    NzIconModule.forRoot(NGIcons),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
