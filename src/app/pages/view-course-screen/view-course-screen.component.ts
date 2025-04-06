import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ICourse } from '../../shared/interfaces/course.interfaces';

@Component({
  selector: 'app-view-course-screen',
  templateUrl: './view-course-screen.component.html',
  styleUrl: './view-course-screen.component.scss',
})
export class ViewCourseScreenComponent implements OnInit {
  courseDetails: ICourse | null = null;

  constructor(
    private route: ActivatedRoute,
    private course: CoursesService,
    private cart: CartService,
    private wishlist: WishlistService
  ) {}

  ngOnInit(): void {
    this.initCourse()
  }

  initCourse() {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (!id) return;

    this.course.onGetCourse(id).subscribe((data) => {
      this.courseDetails = data?.payload ?? null;
    });
  }
}
