import { Component, Input, type OnInit } from '@angular/core';
import { IViolation } from '../../../../shared/interfaces/violations.interface';

@Component({
  selector: 'app-violation-details',
  templateUrl: './violation-details.component.html',
  styleUrl: './violation-details.component.scss',
})
export class ViolationDetailsComponent implements OnInit {
  @Input() violation: IViolation | null = null;

  ngOnInit(): void {}
}
