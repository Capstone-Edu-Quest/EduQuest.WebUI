import { Component, Input, type OnInit } from '@angular/core';

@Component({
  selector: 'app-code-highlight',
  templateUrl: './code-highlight.component.html',
  styleUrl: './code-highlight.component.scss',
})
export class CodeHighlightComponent implements OnInit {
  @Input() language: string = 'javascript';
  @Input() code: string = `{a: 1, b: 2, c: 3}`;

  ngOnInit(): void { }

}
