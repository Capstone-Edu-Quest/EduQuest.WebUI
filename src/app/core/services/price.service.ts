import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Store } from '@ngrx/store';
import { setExchangeRates } from '../state/currency/currency.action';

@Injectable({
  providedIn: 'root',
})
export class PriceService {
  private entry = 'http://data.fixer.io/api/latest';
  private accessKey = '586c402f29f7c4d8796f05b7d056dd20';
  public exchangeRate = null; // from USD

  constructor(private HttpService: HttpService, private Store: Store) {}

  onInitExchangeRate() {
    this.HttpService.getOutside(
      `${this.entry}?access_key=${this.accessKey}`
    ).subscribe((res: any) =>
      this.Store.dispatch(
        setExchangeRates({ rates: this.convertToUSDRates(res.rates) })
      )
    );
  }

  convertToUSDRates = (rates: any) => {
    const usdRate = rates['USD']; // Rate for USD base
    const convertedRates: any = {};

    for (const [currency, rate] of Object.entries(rates)) {
      convertedRates[currency] = (rate as number) / usdRate;
    }

    return convertedRates;
  };
}
