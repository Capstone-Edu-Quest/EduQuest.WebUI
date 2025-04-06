import {
  Component,
  ViewChild,
  type OnInit,
  ElementRef,
  OnDestroy,
} from '@angular/core';
import {
  IDocument,
  IMaterial,
  IMaterialCreate,
} from '../../../../shared/interfaces/course.interfaces';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

@Component({
  selector: 'app-create-document',
  templateUrl: './create-document.component.html',
  styleUrl: './create-document.component.scss',
})
export class CreateDocumentComponent implements OnInit, OnDestroy {
  @ViewChild('textEditor') textEditor!: ElementRef;

  subscription$ = new Subscription();

  isEdit: boolean = false;

  material: IMaterialCreate<IDocument> | IMaterial<IDocument> = {
    title: '',
    description: '',
    type: 'Document',
    data: {
      content: '',
    },
  };

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.listenToRoute();
  }

  listenToRoute() {
    this.subscription$.add(
      this.route.paramMap.subscribe((params) => {
        const documentId = params.get('documentId');
        this.isEdit = !!documentId;
        if (!!documentId) {
          this.onInitDocument(documentId);
        }
      })
    );
  }

  onInitDocument(docId: string) {
    // this.material = this.materialService.getMaterial(docId);
    this.material = {
      id: '1',
      title: '',
      description: '',
      type: 'Document',
      data: {
        content:
          '<h1>Welcome to my Typescript document</h1><p>What is your name?</p>',
      },
    };
  }

  onCancel() {
    this.location.back();
  }

  onUpdate() {
    this.material.data.content = (this.textEditor as any).htmlContent;
    console.log(this.material);
  }

  onCreate() {
    this.material.data.content = (this.textEditor as any).htmlContent;
    console.log(this.material);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
