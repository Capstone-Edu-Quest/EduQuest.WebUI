import { LearningPathService } from './../../../core/services/learning-path.service';
import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, type OnInit } from '@angular/core';
import { ILearningPath } from '../../../shared/interfaces/learning-path.interfaces';
import {
  faClone,
  faPen,
  faShare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { UserService } from '@/src/app/core/services/user.service';
import { Subscription } from 'rxjs';
import { copyToClipboard } from '@/src/app/core/utils/data.utils';
import { MessageService } from '@/src/app/core/services/message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-path-item',
  templateUrl: './path-item.component.html',
  styleUrl: './path-item.component.scss',
})
export class PathItemComponent implements OnInit, OnDestroy {
  @Input('path') path!: ILearningPath;
  @Input('isViewExpert') isViewExpert: boolean = false;

  subscription$: Subscription = new Subscription();

  menu: any[] = [];

  manageMenu = [
    {
      icon: faPen,
      label: 'LABEL.EDIT',
      action: (e: Event) => this.onEdit(e),
    },
    {
      icon: faTrash,
      label: 'LABEL.DELETE',
      action: (e: Event) => this.onDelete(e),
    },
  ];

  commonMenu = [
    {
      icon: faClone,
      label: 'LABEL.CLONE',
      action: (e: Event) => this.onClone(e),
    },
    {
      icon: faShare,
      label: 'LABEL.SHARE',
      action: (e: Event) => this.onShare(e),
    },
  ];

  constructor(
    private router: Router,
    private LearningPathService: LearningPathService,
    private user: UserService,
    private message: MessageService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenToUser();
  }

  onEnroll(e: Event) {
    e.stopPropagation();
    this.LearningPathService.onEnrollLearningPath(this.path.id);
  }

  listenToUser() {
    this.subscription$.add(
      this.user.user$.subscribe((user) => {
        this.menu = [];
        if (!user) return;

        if (user.id === this.path.createdBy.id) {
          this.menu = [...this.manageMenu, ...this.commonMenu];
          return;
        }

        this.menu = [...this.commonMenu];
      })
    );
  }

  onInitMenu() {
    this.menu = this.manageMenu;
    if (!this.isViewExpert) {
      this.menu = [...this.menu, ...this.commonMenu];
    }
  }

  onEdit(e: Event) {
    e.stopPropagation();
    this.router.navigate(
      [
        this.isViewExpert ? '/learning-path-manage' : '/learning-path',
        this.path.id,
      ],
      {
        queryParams: {
          edit: true,
        },
      }
    );
  }

  onDelete(e: Event) {
    e.stopPropagation();
    this.LearningPathService.deleteLearningPath(this.path.id);
  }

  onClone(e: Event) {
    e.stopPropagation();
    this.LearningPathService.cloneLearningPath(this.path.id);
  }

  onShare(e: Event) {
    e.stopPropagation();
    const url = window.location.host + '/learning-path/' + this.path?.id;

    copyToClipboard(url);
    this.message.addMessage(
      'success',
      this.translate.instant('MESSAGE.COPIED_URL')
    );
  }

  onViewDetails() {
    this.router.navigate([
      this.isViewExpert ? '/learning-path-manage' : '/learning-path',
      this.path.id,
    ]);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
