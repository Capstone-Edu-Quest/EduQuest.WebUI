import { CommonModule } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { ILearningPath } from '../../../shared/interfaces/learning-path.interfaces';
import { faClone, faPen, faShare, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-path-item',
  templateUrl: './path-item.component.html',
  styleUrl: './path-item.component.scss',
})
export class PathItemComponent implements OnInit {
  @Input('path') path!: ILearningPath;

  pannelBtn = [
    {
      icon: faPen,
      label: 'LABEL.EDIT',
      action: () => this.onEdit(),
    },
    {
      icon: faTrash,
      label: 'LABEL.DELETE',
      action: () => this.onDelete(),
    },
    {
      icon: faClone,
      label: 'LABEL.CLONE',
      action: () => this.onClone(),
    },
    {
      icon: faShare,
      label: 'LABEL.SHARE',
      action: () => this.onShare(),
    },
  ];

  
  constructor() {}
  ngOnInit(): void {}

  onEdit() {}

  onDelete() {}

  onEnroll() {}

  onClone() {}

  onShare() {}
}
