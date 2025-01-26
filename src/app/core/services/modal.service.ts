import { Injectable, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  public modalContent$ = new BehaviorSubject<TemplateRef<any> | null>(null);

  constructor() {}

  updateModalContent(_modalContent: TemplateRef<any> | null): void {
    this.modalContent$.next(_modalContent);
  }
}
