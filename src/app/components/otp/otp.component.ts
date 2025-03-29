import { Component, ElementRef, ViewChildren, QueryList, HostListener, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss',
})
export class OtpComponent implements OnInit {
  @Output('onKeyChange') otp$ = new EventEmitter<string[]>();
  
  otp: string[] = new Array(6).fill(null);
  
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  ngOnInit(): void { }

  onInput(index: number, event: any) {
    this.otp[index] = event.target.value;
    this.otpInputs.get(index + 1)?.nativeElement.focus();
    this.otp$.emit(this.otp);
  }

  onKeyDown(index: number, event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowRight':
        this.otpInputs.get(index + 1)?.nativeElement.focus();
        break;
      case 'ArrowLeft':
        this.otpInputs.get(index - 1)?.nativeElement.focus();
        break;
    }
  }

  trackByIdx(idx: number) {
    return idx;
  }
}
