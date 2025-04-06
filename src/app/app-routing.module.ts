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
import { MaterialsComponent } from './pages/materials/materials.component';
import { MaterialsVideoComponent } from './pages/materials-group/materials-video/materials-video.component';
import { MaterialsDocumentComponent } from './pages/materials-group/materials-document/materials-document.component';
import { MaterialsQuizComponent } from './pages/materials-group/materials-quiz/materials-quiz.component';
import { MaterialsAssignmentComponent } from './pages/materials-group/materials-assignment/materials-assignment.component';
import { MyRevenueComponent } from './pages/my-revenue/my-revenue.component';
import { CreateVideoComponent } from './pages/materials-group/materials-video/create-video/create-video.component';
import { CreateDocumentComponent } from './pages/materials-group/materials-document/create-document/create-document.component';
import { CreateAssignmentComponent } from './pages/materials-group/materials-assignment/create-assignment/create-assignment.component';
import { CreateQuizComponent } from './pages/materials-group/materials-quiz/create-quiz/create-quiz.component';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { CoursesApprovalComponent } from './pages/courses-manage/courses-approval/courses-approval.component';
import { CoursesCategorizeComponent } from './pages/courses-manage/courses-categorize/courses-categorize.component';
import { LearningPathManageComponent } from './pages/learning-path-manage/learning-path-manage.component';
import { CoursesManageComponent } from './pages/courses-manage/courses-manage.component';
import { CoursesManageViewDetailsComponent } from './pages/courses-manage/courses-manage-view-details/courses-manage-view-details.component';
import { CourseManageExploreComponent } from './pages/courses-manage/course-manage-explore/course-manage-explore.component';
import { UserManageComponent } from './pages/user-manage/user-manage.component';
import { ViolationsManageComponent } from './pages/violations-manage/violations-manage.component';
import { PlatformSettingsComponent } from './pages/platform-settings/platform-settings.component';
import { CoursesStatisticsComponent } from './pages/courses-manage/courses-statistics/courses-statistics.component';
import { PlatformStatisticsComponent } from './pages/platform-settings/platform-statistics/platform-statistics.component';
import { LevelSettingsComponent } from './pages/platform-settings/level-settings/level-settings.component';
import { QuestsSettingsComponent } from './pages/platform-settings/quests-settings/quests-settings.component';
import { ShopSettingsComponent } from './pages/platform-settings/shop-settings/shop-settings.component';
import { CouponsSettingsComponent } from './pages/platform-settings/coupons-settings/coupons-settings.component';
import { PricingComponent } from './pages/pricing/pricing.component';
import { AdvanceSettingsComponent } from './pages/platform-settings/advance-settings/advance-settings.component';
import { PlatformLogsComponent } from './pages/platform-logs/platform-logs.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { ForgotPasswordComponent } from './pages/auth/forgot-password/forgot-password.component';
import { SignupComponent } from './pages/auth/signup/signup.component';
import { PersonalSettingsComponent } from './pages/personal-settings/personal-settings.component';
import { ManagePasswordComponent } from './pages/personal-settings/manage-password/manage-password.component';
import { ViewCourseScreenComponent } from './pages/view-course-screen/view-course-screen.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [RoleGuard],
    data: { blockedRoles: [WebRole.EXPERT], redirectUrl: ['/courses-manage'] },
    component: HomeComponent,
  },
  {
    path: 'courses',
    canActivate: [RoleGuard],
    data: { blockedRoles: [WebRole.ADMIN, WebRole.INSTRUCTOR, WebRole.EXPERT] },
    children: [
      {
        path: '',
        component: CoursesComponent,
      },
      {
        path: ':courseId',
        component: ViewCourseScreenComponent,
        // children: [
        //   {
        //     path: '',
        //     component: CourseDetailsComponent,
        //   },
        //   {
        //     path: 'stages',
        //     component: CourseStageComponent,
        //   },
        // ],
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
    path: 'courses-manage',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.EXPERT, WebRole.STAFF] },
    component: CoursesManageComponent,
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        children: [
          {
            path: '',
            component: CourseManageExploreComponent,
          },
          {
            path: ':courseId',
            component: CoursesManageViewDetailsComponent,
          },
        ],
      },
      {
        path: 'approval',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.EXPERT, WebRole.STAFF] },
        component: CoursesApprovalComponent,
      },
      {
        path: 'categorize',
        component: CoursesCategorizeComponent,
      },
      {
        path: 'statistics',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.ADMIN, WebRole.STAFF] },
        component: CoursesStatisticsComponent,
      },
    ],
  },
  {
    path: 'my-revenue',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.INSTRUCTOR] },
    component: MyRevenueComponent,
  },
  {
    path: 'materials',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.INSTRUCTOR] },
    children: [
      {
        path: '',
        component: MaterialsComponent,
      },
      {
        path: 'videos',
        children: [
          {
            path: '',
            component: MaterialsVideoComponent,
          },
          {
            path: 'new',
            component: CreateVideoComponent,
          },
          {
            path: ':videoId',
            component: CreateVideoComponent,
          },
        ],
      },
      {
        path: 'document',
        children: [
          {
            path: '',
            component: MaterialsDocumentComponent,
          },
          {
            path: 'new',
            component: CreateDocumentComponent,
          },
          {
            path: ':documentId',
            component: CreateDocumentComponent,
          },
        ],
      },
      {
        path: 'quiz',
        children: [
          {
            path: '',
            component: MaterialsQuizComponent,
          },
          {
            path: 'new',
            component: CreateQuizComponent,
          },
          {
            path: ':quizId',
            component: CreateQuizComponent,
          },
        ],
      },
      {
        path: 'assignment',
        children: [
          {
            path: '',
            component: MaterialsAssignmentComponent,
          },
          {
            path: 'new',
            component: CreateAssignmentComponent,
          },
          {
            path: ':assignmentId',
            component: CreateAssignmentComponent,
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
    data: { blockedRoles: [WebRole.EXPERT] },
    children: [
      {
        path: '',
        component: ProfileComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: {
          blockedRoles: [WebRole.ADMIN, WebRole.STAFF],
          redirectUrl: ['/users-manage'],
        },
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
    path: 'learning-path-manage',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.EXPERT, WebRole.STAFF] },
    children: [
      {
        path: '',
        component: LearningPathManageComponent,
      },
      {
        path: ':pathId',
        component: LearningPathDetailsComponent,
      },
    ],
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
  {
    path: 'transactions',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.LEARNER, WebRole.INSTRUCTOR] },
    component: TransactionsComponent,
  },
  {
    path: 'users-manage',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.STAFF, WebRole.ADMIN] },
    component: UserManageComponent,
  },

  {
    path: 'violations-manage',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.STAFF, WebRole.ADMIN] },
    component: ViolationsManageComponent,
  },
  {
    path: 'platform-settings',
    canActivate: [AuthGuard, RoleGuard],
    data: { allowedRoles: [WebRole.STAFF, WebRole.ADMIN] },
    component: PlatformSettingsComponent,
    children: [
      {
        path: '',
        component: PlatformStatisticsComponent,
      },
      {
        path: 'level',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.STAFF] },
        component: LevelSettingsComponent,
      },
      {
        path: 'quests',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.STAFF] },
        component: QuestsSettingsComponent,
      },
      {
        path: 'shop-items',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.STAFF] },
        component: ShopSettingsComponent,
      },
      {
        path: 'coupons',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.STAFF] },
        component: CouponsSettingsComponent,
      },
      {
        path: 'packages-settings',
        canActivate: [RoleGuard],
        data: { allowedRoles: [WebRole.ADMIN] },
        component: AdvanceSettingsComponent,
      },
    ],
  },
  {
    path: 'pricing',
    canActivate: [RoleGuard],
    data: {
      allowedRoles: [WebRole.GUEST, WebRole.LEARNER, WebRole.INSTRUCTOR],
    },
    component: PricingComponent,
  },
  {
    path: 'logs',
    canActivate: [RoleGuard],
    data: {
      allowedRoles: [WebRole.ADMIN],
    },
    component: PlatformLogsComponent,
  },
  {
    path: 'signin',
    canActivate: [RoleGuard],
    data: {
      blockedRoles: [
        WebRole.LEARNER,
        WebRole.INSTRUCTOR,
        WebRole.EXPERT,
        WebRole.STAFF,
        WebRole.ADMIN,
      ],
    },
    component: SigninComponent,
  },
  {
    path: 'forgot-password',
    canActivate: [RoleGuard],
    data: {
      blockedRoles: [
        WebRole.LEARNER,
        WebRole.INSTRUCTOR,
        WebRole.EXPERT,
        WebRole.STAFF,
        WebRole.ADMIN,
      ],
    },
    component: ForgotPasswordComponent,
  },
  {
    path: 'signup',
    canActivate: [RoleGuard],
    data: {
      blockedRoles: [
        WebRole.LEARNER,
        WebRole.INSTRUCTOR,
        WebRole.EXPERT,
        WebRole.STAFF,
        WebRole.ADMIN,
      ],
    },
    component: SignupComponent,
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    component: PersonalSettingsComponent,
    children: [
      {
        path: 'password',
        component: ManagePasswordComponent,
      },
      {
        path: '',
        redirectTo: 'password',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
