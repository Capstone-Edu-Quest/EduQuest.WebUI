import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CoursesService } from '../../core/services/courses.service';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss'],
  animations: [fadeInOutAnimation],
})
export class CourseDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private course: CoursesService) {}

  ngOnInit() {}

  onInitCourse() {
    const id = this.route.snapshot.paramMap.get('courseId');
    if (!id) return;
    this.course.onGetCourse(id);
  }
}
