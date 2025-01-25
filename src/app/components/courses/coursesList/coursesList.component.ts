import { Component, Input, OnInit } from '@angular/core';
import { ICourse } from '../../../shared/interfaces/CourseInterfaces';

@Component({
  selector: 'app-coursesList',
  templateUrl: './coursesList.component.html',
  styleUrls: ['./coursesList.component.scss'],
})
export class CoursesListComponent implements OnInit {
  @Input('courses') courses: ICourse[] = [];

  constructor() {}

  ngOnInit() {}
}
