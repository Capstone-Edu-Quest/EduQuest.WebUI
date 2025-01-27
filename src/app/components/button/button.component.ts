import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input('type') type: string = 'secondary';
  @Input('icon') icon: string | null = null;
  @Input('style') style = {};
  
  constructor() { }

  ngOnInit() {
  }

}
