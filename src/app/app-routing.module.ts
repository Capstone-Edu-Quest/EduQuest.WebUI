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
        component: CourseDetailsComponent
      }
    ],
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'chat',
    component: ChatComponent,
    children: [
      {
        path: ':conversationId',
        component: ConversationMessageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
