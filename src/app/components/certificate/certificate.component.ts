import {
  ChangeDetectionStrategy,
  Component,
  Input,
  type OnInit,
} from '@angular/core';
import { ICertificateRes } from '../../shared/interfaces/others.interfaces';
import { formatTime } from '../../core/utils/time.utils';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrl: './certificate.component.scss',
})
export class CertificateComponent implements OnInit {
  @Input('certificate') certificate!: ICertificateRes | null;

  ngOnInit(): void {}

  formatIssuedDate(time: string) {
    return formatTime(time)
  }
}
