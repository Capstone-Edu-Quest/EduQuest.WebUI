import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { fadeInOutAnimation } from '../../shared/constants/animations.constant';

@Component({
  selector: 'app-dropdownMenu',
  templateUrl: './dropdownMenu.component.html',
  styleUrls: ['./dropdownMenu.component.scss'],
  animations: [fadeInOutAnimation],
})
export class DropdownMenuComponent implements OnInit {
  @Input('dropdown') dropdown: TemplateRef<any> | null = null;
  @Input('colorVariable') colorVariable: string | null = null;

  position = 'center';

  @ViewChild('dropdownMenu') dropdownMenu!: ElementRef<HTMLDivElement>;

  isHovering: boolean = false;

  constructor() {}

  ngOnInit() {}

  updateHoverStatus(hovering: boolean) {
    this.isHovering = hovering;

    if (hovering) {
      // Wait for Angular to render the dropdown before getting its position
      setTimeout(() => this.initPosition(), 0);
    }
  }

  initPosition() {
    const rect = this.dropdownMenu.nativeElement.getBoundingClientRect();
    const screenWidth = window.innerWidth;

    if (rect.right > screenWidth) {
      this.position = 'left';
    }
  }
}
