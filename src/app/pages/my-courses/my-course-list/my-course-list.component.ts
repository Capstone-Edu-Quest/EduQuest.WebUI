import { CoursesService } from 'src/app/core/services/courses.service';
import { Component, type OnInit } from '@angular/core';
import { ICourseOverview } from '../../../shared/interfaces/course.interfaces';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-course-list',
  templateUrl: './my-course-list.component.html',
  styleUrl: './my-course-list.component.scss',
})
export class MyCourseListComponent implements OnInit {

  addIcon = faPlus;
  courses: ICourseOverview[] = []

  constructor(private CoursesService: CoursesService) { }

  ngOnInit(): void {
    this.onInitMyCourses()
  }

  onInitMyCourses() {
    this.CoursesService.onGetCourseCreatedByMe().subscribe(res => {
      if(!res?.payload) return;

      this.courses = res.payload
    }) 
  }
}
