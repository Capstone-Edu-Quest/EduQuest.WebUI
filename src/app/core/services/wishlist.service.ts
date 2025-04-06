import { Injectable } from '@angular/core';
import {
  ICourse,
  ICourseOverview,
} from '../../shared/interfaces/course.interfaces';
import { BehaviorSubject } from 'rxjs';
import { HttpService } from './http.service';
import { endPoints } from '../../shared/constants/endPoints.constant';
import { UserService } from './user.service';
import { WebRole } from '../../shared/enums/user.enum';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  public wishlist$: BehaviorSubject<ICourseOverview[]> = new BehaviorSubject<
    ICourseOverview[]
  >([]);

  constructor(private http: HttpService) {}

  initWishlist() {
    this.http
      .get<ICourseOverview[]>(endPoints.favoriteList)
      .subscribe((res) => {
        if (!res?.payload) return;

        this.wishlist$.next(res.payload);
      });
  }

  updateWishlist(course: ICourseOverview) {
    const courses = this.wishlist$.value;
    const index = courses.findIndex((c) => c.id === course.id);

    if (index === -1) {
      courses.push(course);
    } else {
      courses.splice(index, 1);
    }

    const ids = courses.map((c) => c.id);
    this.http.update(endPoints.favoriteList, ids).subscribe((res) => {
      if (!res || res.isError) return;
      this.wishlist$.next(courses);
    });
  }

  remove(course: ICourseOverview) {
    const courses = this.wishlist$.value;
    const index = courses.findIndex((c) => c.id === course.id);
    if (index !== -1) {
      courses.splice(index, 1);

      const ids = courses.map((c) => c.id);
      this.http.update(endPoints.favoriteList, ids).subscribe((res) => {
        if (!res || res.isError) return;
        this.wishlist$.next(courses);
      });
    }
  }

  destroyWishList() {
    this.wishlist$.next([]);
  }
}
