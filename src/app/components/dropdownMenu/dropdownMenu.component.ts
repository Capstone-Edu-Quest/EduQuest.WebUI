import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
  SimpleChange,
  SimpleChanges,
  TemplateRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-dropdownMenu',
  templateUrl: './dropdownMenu.component.html',
  styleUrls: ['./dropdownMenu.component.scss'],
})
export class DropdownMenuComponent implements OnInit {
  @Input('dropdown') dropdown: TemplateRef<any> | null = null;
  @Input('position') position?: 'left' | 'right' | 'center' = 'center';

  isHovering: boolean = false;

  constructor() {}

  ngOnInit() {}

  updateHoverStatus(hovering: boolean) {
    this.isHovering = hovering;
  }
}
