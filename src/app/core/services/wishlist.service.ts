import { Injectable } from '@angular/core';
import { ICourse } from '../../shared/interfaces/course.interfaces';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private courses: ICourse[] = [];
  public wishlist$: BehaviorSubject<ICourse[]> = new BehaviorSubject(
    this.courses
  );

  constructor() {}

  initWishlist() {
    // Call API
  }

  updateWishlist(course: ICourse) {
    const index = this.courses.findIndex((c) => c.id === course.id);
    if (index === -1) {
      this.courses.push(course);
    } else {
      this.courses.splice(index, 1);
    }
    
    this.wishlist$.next(this.courses);
  }

  remove(course: ICourse) {
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
