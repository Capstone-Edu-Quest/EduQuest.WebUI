import { Component, type OnInit } from '@angular/core';
import { ICourseManage } from '../../../shared/interfaces/course.interfaces';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-course-list',
  templateUrl: './my-course-list.component.html',
  styleUrl: './my-course-list.component.scss',
})
export class MyCourseListComponent implements OnInit {
  sampleCourses: ICourseManage[] = [];

  addIcon = faPlus

  constructor() { }
  ngOnInit(): void { }

}
