import { Component, OnDestroy, OnInit } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
})
export class TextEditorComponent implements OnInit, OnDestroy {
  editor!: Editor; // Define the editor instance
  htmlContent = '<p>Start typing...</p>'; // Initial content

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    // or, set options for link:
    //[{ link: { showOpenInNewTab: false } }, 'image'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    // ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];

  ngOnInit() {
    this.editor = new Editor(); // Initialize editor in ngOnInit()
  }

  ngOnDestroy(): void {
    this.editor.destroy(); // Destroy to prevent memory leaks
  }
}
