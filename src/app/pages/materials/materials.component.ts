import { Component, OnDestroy, type OnInit } from '@angular/core';
import { faAngleRight, faCode } from '@fortawesome/free-solid-svg-icons';
import { IMaterialResponse } from '../../shared/interfaces/course.interfaces';
import { faClock, faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { CoursesService } from '../../core/services/courses.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.component.html',
  styleUrl: './materials.component.scss',
})
export class MaterialsComponent implements OnInit, OnDestroy {
  subscription$: Subscription = new Subscription();

  clockIcon = faClock;
  viewAllIcon = faAngleRight;
  questionIcon = faQuestionCircle;
  codeIcon = faCode;

  materialsSection: any[] = [];

  constructor(private course: CoursesService) {}

  ngOnInit(): void {
    this.listenToMaterialsList();
  }

  listenToMaterialsList() {
    this.subscription$.add(
      this.course.myMaterials$.subscribe((materials) => {
        this.materialsSection = [];
        if (!materials) return;

        const materialsList = Object.keys(materials);
        materialsList.forEach((section) => {
          this.materialsSection.push({
            id: section,
            label: `LABEL.${section.toUpperCase()}`,
            description: `LABEL.${section.toUpperCase()}_DESCRIPTION`,
            value: {
              value: materials[section as keyof IMaterialResponse].total,
            },
          });
        });
      })
    );
  }

  get3Materials(materialType: string): any[] {
    if (!this.course.myMaterials$.value) return [];

    const materials: IMaterialResponse = this.course.myMaterials$.value;

    switch (materialType.toLowerCase()) {
      case 'video':
        return materials.videos.items.slice(
          0,
          Math.min(3, materials.videos.items.length)
        );
      case 'document':
        return materials.document.items.slice(
          0,
          Math.min(3, materials.document.items.length)
        );
      case 'quiz':
        return materials.quiz.items.slice(
          0,
          Math.min(3, materials.quiz.items.length)
        );
      case 'assignment':
        return materials.assignment.items.slice(
          0,
          Math.min(3, materials.assignment.items.length)
        );
      default:
        return [];
    }
  }

  round(val: number) {
    return Math.ceil(val)
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
