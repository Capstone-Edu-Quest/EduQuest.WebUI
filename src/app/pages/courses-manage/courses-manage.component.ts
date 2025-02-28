import { Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-courses-manage',
  templateUrl: './courses-manage.component.html',
  styleUrl: './courses-manage.component.scss',
})
export class CoursesManageComponent implements OnInit {

  tabs = [
    { label: 'LABEL.COUSRE_APPROVAL', link: 'approval' },
    { label: 'LABEL.COUSRE_CATEGORIZE', link: 'categorize' },
    { label: 'LABEL.COURSE_EXPLORE', link: 'explore' },
  ]

  ngOnInit(): void { }

}
