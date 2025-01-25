import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PriceService } from '../../core/services/price.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private PriceService: PriceService) { }
  
  ngOnInit() {
    this.PriceService.onInitExchangeRate();
  }

}
