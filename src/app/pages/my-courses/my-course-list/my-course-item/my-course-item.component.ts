import { Component, Input, type OnInit } from '@angular/core';
import { ICourse } from '../../../../shared/interfaces/course.interfaces';
import { faPen, faStar, faStarHalfStroke, faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-my-course-item',
  templateUrl: './my-course-item.component.html',
  styleUrl: './my-course-item.component.scss',
})
export class MyCourseItemComponent implements OnInit {
  @Input() course!: ICourse;

  pannelBtn = [
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
    // {
    //   icon: faClone,
    //   label: 'LABEL.CLONE',
    //   action: (e: Event) => this.onClone(e),
    // },
    // {
    //   icon: faShare,
    //   label: 'LABEL.SHARE',
    //   action: (e: Event) => this.onShare(e),
    // },
  ];

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;
  starsList: any[] = [];

  ngOnInit(): void {
    this.initStars();
  }

  initStars() {
    if (!this.course) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.course?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  onEdit(e: Event) {
    e.stopPropagation();
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }
}
