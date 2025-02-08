import { RouterModule, Routes, provideRouter } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NgModule } from '@angular/core';
import { CoursesComponent } from './pages/courses/courses.component';
import { CartComponent } from './pages/cart/cart.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { AuthGuard } from './core/guards/auth.guards';
import { CourseDetailsComponent } from './pages/course-details/course-details.component';
import { ChatComponent } from './pages/chat/chat.component';
import { ConversationMessageComponent } from './pages/chat/conversation-message/conversation-message.component';
import { AboutComponent } from './pages/about/about.component';
import { TermsComponent } from './pages/terms/terms.component';
import { PrivacyComponent } from './pages/privacy/privacy.component';
import { FoxItemsComponent } from './pages/fox-items/fox-items.component';
import { CourseStageComponent } from './pages/course-stage/course-stage.component';
import { LeaningPathComponent } from './pages/leaning-path/leaning-path.component';
import { LearningPathDetailsComponent } from './pages/learning-path-details/learning-path-details.component';
import { ShopItemsComponent } from './pages/shop-items/shop-items.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'courses',
    children: [
      {
        path: '',
        component: CoursesComponent,
      },
      {
        path: ':courseId',
        children: [
          {
            path: '',
            component: CourseDetailsComponent,
          },
          {
            path: 'stages',
            component: CourseStageComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: ':conversationId',
        component: ConversationMessageComponent,
      },
    ],
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'terms',
    component: TermsComponent,
  },
  {
    path: 'privacy',
    component: PrivacyComponent,
  },
  {
    path: 'items',
    component: FoxItemsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'shop-items',
    component: ShopItemsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'learning-path',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: LeaningPathComponent,
      },
      {
        path: ':pathId',
        component: LearningPathDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
