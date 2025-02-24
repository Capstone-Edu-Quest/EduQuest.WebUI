import { Component, Input, type OnInit } from '@angular/core';
import 'codemirror/mode/javascript/javascript'; // JavaScript
import 'codemirror/mode/python/python'; // Python
import 'codemirror/mode/clike/clike'; // C, C++, C#, Java
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { CastJson, convertToObjectOrArray, deepEqual } from '../../core/utils/data.utils';

@Component({
  selector: 'app-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrl: './code-editor.component.scss',
})
export class CodeEditorComponent implements OnInit {
  @Input() language: string = 'javascript';
  @Input('arguments') arguments: any[] = [];
  @Input() expectedAnswer: string = '';

  compareAnswer = CastJson(this.expectedAnswer);

  playIcon = faPlay;

  isFirstTime = true;
  currentResult: any = null;
  currentResultString: string = '';
  isError: boolean = false;

  args = '';
  code = ``;
  editorOptions = {
    mode: this.language.toLocaleLowerCase(),
    theme: 'dracula',
    lineNumbers: true,
    smartIndent: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    lint: true, // Enable linting
    gutters: ['CodeMirror-lint-markers'], // Show linting warnings
    hintOptions: { completeSingle: false },
  };
  ngOnInit(): void {
    this.initCode();
  }

  checkResult() {
    return deepEqual(this.currentResult, this.compareAnswer);
  }

  initCode() {
    this.args = JSON.stringify(this.arguments);
    const arg = this.arguments.map((a, i) => 'n' + (i + 1)).join(', ');
    this.code = `// Only implement your code inside the function \n\n function assignment(${arg}) {}`;
    this.compareAnswer =
      typeof CastJson(this.expectedAnswer) === 'string'
        ? convertToObjectOrArray(this.expectedAnswer)
        : CastJson(this.expectedAnswer)
  }

  runCode() {
    this.isFirstTime = false;
    try {
      if (this.language.toLocaleLowerCase() === 'javascript') {
        const functionBody = this.code
          .replace(/.*function\s+\w+\(([^)]*)\)\s*{/, '')
          .replace(/}$/, '');
        const argMatch = this.code.match(/\(([^)]*)\)/);
        const args = argMatch ? argMatch[1] : '';

        const f = new Function(args, functionBody);
        const convertedArg = this.arguments.map((a) => CastJson(a));
        const result = f(...convertedArg);

        this.currentResult = result;
        this.currentResultString = JSON.stringify(result);
        this.isError = false;
      }
    } catch (e: any) {
      this.isError = true;
      this.currentResultString = e.toString();
      this.currentResult = null;
    }
  }
}
