import { Component, type OnInit } from '@angular/core';
import {
  IDocument,
  IMaterial,
} from '../../../shared/interfaces/course.interfaces';
import { faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';

@Component({
  selector: 'app-materials-document',
  templateUrl: './materials-document.component.html',
  styleUrl: './materials-document.component.scss',
})
export class MaterialsDocumentComponent implements OnInit {
  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;

  documentMaterials: IMaterial<IDocument>[] = [
    {
      id: 'doc-001',
      title: 'Introduction to TypeScript',
      description: 'A beginner-friendly introduction to TypeScript.',
      type: 'Document',
      data: {
        content:
          '<h1>Welcome to TypeScript</h1><p>TypeScript is a typed superset of JavaScript...</p>',
      },
    },
    {
      id: 'doc-002',
      title: 'Angular Basics',
      description:
        'Understanding components, modules, and services in Angular.',
      type: 'Document',
      data: {
        content:
          '<h2>Angular Overview</h2><p>Angular is a popular front-end framework...</p>',
      },
    },
    {
      id: 'doc-003',
      title: 'Web Security Essentials',
      description: 'Learn the fundamentals of securing web applications.',
      type: 'Document',
      data: {
        content:
          '<h3>Security Best Practices</h3><ul><li>Use HTTPS</li><li>Validate Inputs</li></ul>',
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onCreate() {
    this.router.navigate(['materials', 'document', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'document', id]);
  }

  onDelete(e: Event) {
    e.stopPropagation();
  }
}
