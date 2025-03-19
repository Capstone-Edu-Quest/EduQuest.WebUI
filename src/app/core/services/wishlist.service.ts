import { Injectable } from '@angular/core';
import { ICourse, ICourseOverview } from '../../shared/interfaces/course.interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private courses: ICourseOverview[] = [];
  public wishlist$: BehaviorSubject<ICourseOverview[]> = new BehaviorSubject(
    this.courses
  );

  constructor() {}

  initWishlist() {
    // Call API
  }

  updateWishlist(course: ICourseOverview) {
    const index = this.courses.findIndex((c) => c.id === course.id);
    if (index === -1) {
      this.courses.push(course);
    } else {
      this.courses.splice(index, 1);
    }
    
    this.wishlist$.next(this.courses);
  }

  remove(course: ICourseOverview) {
    const index = this.courses.findIndex((c) => c.id === course.id);
    if (index !== -1) {
      this.courses.splice(index, 1);
      this.wishlist$.next(this.courses);
    }
  }

  destroyWishList() {
    this.wishlist$.next([]);
  }
}
