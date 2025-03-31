import { Component, type OnInit } from '@angular/core';
import { ICourse } from '../../../shared/interfaces/course.interfaces';
import { fadeInOutAnimation } from '../../../shared/constants/animations.constant';

@Component({
  selector: 'app-course-manage-explore',
  templateUrl: './course-manage-explore.component.html',
  styleUrl: './course-manage-explore.component.scss',
  animations: [fadeInOutAnimation]
})
export class CourseManageExploreComponent implements OnInit {
  searchText: string = '';
  currentResultSearch: string = ''

  sampleCourses: ICourse[] = [];

  ngOnInit(): void { }

  onConfirmSearchCourse(e: KeyboardEvent) {
    if (e.key !== 'Enter' || !this.searchText.trim()) return;
    this.currentResultSearch = this.searchText; 
    this.searchText = '';
  }

}
