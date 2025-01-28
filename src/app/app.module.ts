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
import { PipesModule } from './core/pipes/pipes.module';
import { ThemeService } from './core/services/theme.service';
import { PriceService } from './core/services/price.service';
import { ModalService } from './core/services/modal.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ChatService } from './core/services/chat.service';
import { CartService } from './core/services/cart.service';
import { WishlistService } from './core/services/wishlist.service';
import { NotificationService } from './core/services/notification.service';
import { CouponService } from './core/services/coupon.service';
import { MessageService } from './core/services/message.service';

// Factory function for TranslateHttpLoader
export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json'); // You may specify the path to your translation files
}

@NgModule({
  declarations: AppDeclarations,
  imports: [
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
  providers: [HttpClient, MessageService, ThemeService, PriceService, ModalService, ChatService, CartService, WishlistService, NotificationService, CouponService],
  bootstrap: [AppComponent],
})
export class AppModule {}
