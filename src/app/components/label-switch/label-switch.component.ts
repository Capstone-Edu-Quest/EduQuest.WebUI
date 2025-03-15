import { Component, EventEmitter, Input, Output, type OnInit } from '@angular/core';

@Component({
  selector: 'app-label-switch',
  templateUrl: './label-switch.component.html',
  styleUrl: './label-switch.component.scss',
})
export class LabelSwitchComponent implements OnInit {
  @Input() switchValues: {key: number | string, label: string}[] = [];
  @Output() onValueChange: EventEmitter<number | string> = new EventEmitter<number | string>();

  selectedIndex: number = 0;

  ngOnInit(): void { }

  onChange(key: number | string): void {
    this.selectedIndex = this.switchValues.findIndex(s => s.key === key);
    this.onValueChange.emit(key);
  }

}
