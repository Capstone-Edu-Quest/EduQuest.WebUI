import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { ILearningPath } from '../../../shared/interfaces/learning-path.interfaces';
import {
  faClone,
  faPen,
  faShare,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-path-item',
  templateUrl: './path-item.component.html',
  styleUrl: './path-item.component.scss',
})
export class PathItemComponent implements OnInit {
  @Input('path') path!: ILearningPath;
  @Input('isViewExpert') isViewExpert: boolean = false;

  menu: any[] = [];

  commonMenu = [
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

  learnerMenu = [
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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.onInitMenu();
  }

  onEnroll(e: Event) {
    e.stopPropagation();
  }

  onInitMenu() {
    this.menu = this.commonMenu;
    if (!this.isViewExpert) {
      this.menu = [...this.menu, ...this.learnerMenu];
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
  }

  onClone(e: Event) {
    e.stopPropagation();
  }

  onShare(e: Event) {
    e.stopPropagation();
  }

  onViewDetails() {
    this.router.navigate([
      this.isViewExpert ? '/learning-path-manage' : '/learning-path',
      this.path.id,
    ]);
  }
}
