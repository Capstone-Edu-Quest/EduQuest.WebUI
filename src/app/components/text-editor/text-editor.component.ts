import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
})
export class TextEditorComponent implements OnInit, OnDestroy, OnChanges {
  @Output() onChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() htmlContent: string = '';

  editor!: Editor; // Define the editor instance

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    // ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    // ['horizontal_rule', 'format_clear', 'indent', 'outdent'],
    // ['superscript', 'subscript'],
    ['undo', 'redo'],
  ];
  ngOnInit() {
    this.editor = new Editor(); // Initialize editor in ngOnInit()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['htmlContent']) {
      console.log(changes['htmlContent'])
      // this.onChange.emit(changes['htmlContent'] as string)
    }
  }

  ngOnDestroy(): void {
    this.editor.destroy(); // Destroy to prevent memory leaks
  }
}
