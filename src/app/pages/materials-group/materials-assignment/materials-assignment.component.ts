import { Component, type OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCode,
  faPen,
  faPlus,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  IAssignment,
  IMaterial,
} from '../../../shared/interfaces/course.interfaces';
import { AssignmentLanguageEnum } from '../../../shared/enums/materials.enum';

@Component({
  selector: 'app-materials-assignment',
  templateUrl: './materials-assignment.component.html',
  styleUrl: './materials-assignment.component.scss',
})
export class MaterialsAssignmentComponent implements OnInit {
  addIcon = faPlus;
  editIcon = faPen;
  deleteIcon = faTrash;
  codeIcon = faCode;

  materials: IMaterial<IAssignment>[] = [
    {
      id: '1',
      name: 'JavaScript Basics',
      description: 'An assignment on fundamental JavaScript syntax.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question: 'Write a function that returns the sum of two numbers.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: '(a: number, b: number) => a + b',
      },
    },
    {
      id: '2',
      name: 'Python Loops',
      description: 'Practice problem on loops in Python.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          'Write a Python function to print numbers from 1 to 10 using a loop.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: 'for i in range(1, 11): print(i)',
      },
    },
    {
      id: '3',
      name: 'TypeScript Interfaces',
      description: 'Understanding TypeScript interfaces and how to use them.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question:
          'Define an interface for a User with properties: id, name, and email.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: `interface User { id: number; name: string; email: string; }`,
      },
    },
    {
      id: '4',
      name: 'Writing a Summary',
      description: 'Practice writing a short summary on a given topic.',
      type: 'assignment',
      data: {
        inputArguments: [],
        question: 'Write a short summary about the importance of clean code.',
        answerLanguage: AssignmentLanguageEnum.JAVASCRIPT,
        expectedAnswer: null, // Since it's a subjective answer
      },
    },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onCreate() {
    this.router.navigate(['materials', 'assignment', 'new']);
  }

  onEdit(e: Event, id: string) {
    e.stopPropagation();
    this.router.navigate(['materials', 'assignment', id]);
  }

  onDelete(e: Event) {
    e.stopPropagation();
    // Delete the material
  }
}
