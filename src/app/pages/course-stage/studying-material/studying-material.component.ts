import { MaterialTypeEnum } from '@/src/app/shared/enums/course.enum';
import { ILearningMaterial } from '@/src/app/shared/interfaces/course.interfaces';
import { Component, Input, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-studying-material',
  templateUrl: './studying-material.component.html',
  styleUrl: './studying-material.component.scss',
})
export class StudyingMaterialComponent implements OnInit {
  @Input('viewingMaterial') viewingMaterial: ILearningMaterial | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}
  ngOnInit(): void {}

  backIcon = faAngleLeft;

  onBack() {
    this.router.navigate([], { queryParams: {} });
  }

  currentMaterials() {
    if (!this.viewingMaterial) return '';
    switch (this.viewingMaterial.type as any) {
      case 'Video':
      case MaterialTypeEnum.VIDEO:
        return 'Video';
      case 'Quiz':
      case MaterialTypeEnum.QUIZ:
        return 'Quiz';
      case 'Assignment':
      case MaterialTypeEnum.ASSIGNMENT:
        return 'Assignment';
      case 'Document':
      case MaterialTypeEnum.DOCUMENT:
      default:
        return 'Document';
    }
  }
}
