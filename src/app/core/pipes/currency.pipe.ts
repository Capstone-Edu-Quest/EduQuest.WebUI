import { Pipe, PipeTransform, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectExchangeRates } from '../state/currency/currency.selectors';

@Pipe({
  name: 'currencyExchange',
  pure: false, // Ensures it reacts to state changes
})
export class CurrencyExchangePipe implements PipeTransform, OnDestroy {
  private exchangeRates: { [key: string]: number } = {};
  private currentLanguage: string;
  private subscription$: Subscription = new Subscription();

  constructor(
    private translate: TranslateService,
    private store: Store<{}>
  ) {
    // Listen for language changes
    this.subscription$.add(
      this.translate.onLangChange.subscribe((event) => {
        this.currentLanguage = event.lang;
      })
    );

    // Set initial language
    this.currentLanguage = this.translate.currentLang || 'en';

    // Subscribe to exchange rates from the store
    this.subscription$.add(
      this.store.pipe(select(selectExchangeRates)).subscribe((rates) => {
        this.exchangeRates = rates || {};
      })
    );
  }

  transform(amount: number): number {
    if (!amount || !this.exchangeRates) return 0;

    // Map language to currency
    const languageToCurrency: { [key: string]: string } = {
      en: 'USD',
      vi: 'VND',
      cn: 'CNY',
      jp: 'JPY',
    };

    const targetCurrency = languageToCurrency[this.currentLanguage] || 'USD';
    const rate = this.exchangeRates[targetCurrency];

    if (!rate) return amount; // If no rate for the target currency
    return Number((amount * rate).toFixed(2)); // Convert to target currency
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe(); // Clean up subscriptions
  }
}
