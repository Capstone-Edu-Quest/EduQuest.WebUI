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
import { RoleGuard } from './core/guards/role.guards';
import { WebRole } from './shared/enums/user.enum';
import { MyCoursesComponent } from './pages/my-courses/my-courses.component';
import { MyCourseAddComponent } from './pages/my-course-add/my-course-add.component';
import { MyCourseDetailsComponent } from './pages/my-course-details/my-course-details.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'courses',
    canActivate: [RoleGuard],
    data: { blockedRoles: [WebRole.ADMIN, WebRole.INSTRUCTOR] },
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
    path: 'my-courses',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.INSTRUCTOR] },
    children: [
      {
        path: '',
        component: MyCoursesComponent,
      },
      {
        path: 'add',
        component: MyCourseAddComponent,
      },
      {
        path: ':courseId',
        children: [
          {
            path: 'edit',
            component: MyCourseAddComponent,
          },
          {
            path: '',
            component: MyCourseDetailsComponent,
          },
        ],
      },
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER] },
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER] },
  },
  {
    path: 'profile',
    canActivate: [RoleGuard],
    data: { blockedRoles: [WebRole.ADMIN] },
    children: [
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard],
      },
      {
        path: ':userId',
        component: ProfileComponent,
      },
    ],
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER, WebRole.INSTRUCTOR] },
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
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER] },
  },
  {
    path: 'shop-items',
    component: ShopItemsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER] },
  },
  {
    path: 'learning-path',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER] },
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
