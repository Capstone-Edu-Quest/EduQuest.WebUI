import { Component, type OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ICertificateReq,
  ICertificateRes,
} from '../../shared/interfaces/others.interfaces';
import { UserService } from '../../core/services/user.service';
import { formatTime } from '../../core/utils/time.utils';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-certificate-page',
  templateUrl: './certificate-page.component.html',
  styleUrl: './certificate-page.component.scss',
})
export class CertificatePageComponent implements OnInit {
  certificate: ICertificateRes | null = null;

  star = faStar;
  starNone = faStarRegular;
  starHalf = faStarHalfStroke;

  starsList: any[] = [];

  constructor(private route: ActivatedRoute, private user: UserService, private router: Router) {}

  ngOnInit(): void {
    const params: ICertificateReq = {
      Id: this.route.snapshot.params['certificateId'],
    };

    if (!params.Id) return;
    this.user.getCertificate(params).subscribe((res) => {
      this.certificate = (res?.payload ?? [])[0] ?? null;
      this.initStars();
    });

  }

  initStars() {
    if (!this.certificate?.course) return;

    this.starsList = Array(5)
      .fill(null)
      .map((_, i) => {
        const rating = this.certificate?.course?.rating! - i;

        if (rating >= 1) return this.star;
        if (rating > 0) return this.starHalf;
        return this.starNone;
      });
  }

  getFormattedTime(time: string) {
    return formatTime(time)
  }

  onViewCourse() {
    this.router.navigate(['/courses', this.certificate?.course?.id])
  }

  round(val: number) {
    return Math.ceil(val);
  }
}
