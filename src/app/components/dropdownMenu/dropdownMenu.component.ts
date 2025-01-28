import {
  Component,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-dropdownMenu',
  templateUrl: './dropdownMenu.component.html',
  styleUrls: ['./dropdownMenu.component.scss'],
  animations: [fadeInOutAnimation]
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
