import { Component, Input, OnInit } from '@angular/core';
import {
  ILessonOverview,
  IMaterialOverview,
  materialType,
} from '../../../shared/interfaces/course.interfaces';
import { CoursesService } from '../../../core/services/courses.service';

@Component({
  selector: 'app-course-section',
  templateUrl: './course-section.component.html',
  styleUrls: ['./course-section.component.scss'],
})
export class CourseSectionComponent implements OnInit {
  @Input('lesson') lesson: ILessonOverview | null = null;
  @Input('index') index: number = 0;
  isDropDown: boolean = false;

  constructor(private course: CoursesService) {}

  ngOnInit() {}

  onExpand() {
    this.isDropDown = !this.isDropDown;
  }

  onGetIcon(type: materialType) {
    return this.course.onGetMaterialIcon(type);
  }

  round(val: number) {
    return Math.ceil(val)
  }
}
