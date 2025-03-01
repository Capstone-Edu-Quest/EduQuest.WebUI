import { animate, style, transition, trigger } from '@angular/animations';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';
import { UserService } from '../../core/services/user.service';
import { IUser, IUserStat } from '../../shared/interfaces/user.interfaces';
import { Subscription } from 'rxjs';
import { WebRole } from '../../shared/enums/user.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [fadeInOutAnimation],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('notSignIn') guestRef!: TemplateRef<any>;
  @ViewChild('leaner') leanerRef!: TemplateRef<any>;
  @ViewChild('instructor') instructorRef!: TemplateRef<any>;
  @ViewChild('staff') staffRef!: TemplateRef<any>;
  @ViewChild('admin') adminRef!: TemplateRef<any>;

  user: IUser | null = null;
  subscription$: Subscription = new Subscription();

  currentRef: TemplateRef<any> | null = null;

  constructor(public UserService: UserService, private cdRef: ChangeDetectorRef) {}

  ngOnInit() {}

  ngAfterViewInit(): void {
    this.listenToUser();
  }

  listenToUser() {
    this.subscription$.add(
      this.UserService.user$.subscribe((user) => {
        this.user = user;
        this.currentRef = this.onGetRef();

        this.cdRef.detectChanges();
      })
    );
  }

  onGetRef() {
    if (!this.user) return this.guestRef;

    switch (this.user.roleId) {
      case WebRole.INSTRUCTOR:
        return this.instructorRef;
      case WebRole.STAFF:
        return this.staffRef;
      case WebRole.ADMIN:
        return this.adminRef;
      case WebRole.LEARNER:
      default:
        return this.leanerRef;
    }
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
