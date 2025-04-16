import { ICourse } from '@/src/app/shared/interfaces/course.interfaces';
import {
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import {
  faStar,
  faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons';
import {
  faStar as faStarRegular,
} from '@fortawesome/free-regular-svg-icons';
import { handleCastDateString } from '@/src/app/core/utils/time.utils';

@Component({
  selector: 'app-minify-course-info',
  templateUrl: './minify-course-info.component.html',
  styleUrl: './minify-course-info.component.scss',
})
export class MinifyCourseInfoComponent implements OnInit {
  @Input('courseDetails') courseDetails!: ICourse;

  authorStatsIcon = ['play-circle', 'user', 'comment', 'star'];

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  ngOnInit(): void {
    this.initStars();
  }

  initStars() {
    if (!this.courseDetails) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.courseDetails?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  onGetCourseLastUpdate() {
    return handleCastDateString(
      new Date(this.courseDetails?.lastUpdated ?? '').toLocaleDateString()
    );
  }
}
