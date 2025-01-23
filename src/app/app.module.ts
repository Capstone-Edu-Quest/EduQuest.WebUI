import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClient } from '@angular/common/http';  // Make sure HttpClient is imported here
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HomeComponent } from './pages/home/home/home.component';
import { AppDeclarations } from './app.declarations';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json');  // You may specify the path to your translation files
}

@NgModule({
  declarations: AppDeclarations,
  imports: [
    BrowserModule,
    HttpClientModule,  
    AppRoutingModule,
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
