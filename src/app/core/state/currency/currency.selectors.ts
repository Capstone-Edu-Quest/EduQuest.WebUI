import { createFeatureSelector, createSelector } from '@ngrx/store';

export const selectCurrencyState = createFeatureSelector<any>('currency');
export const selectExchangeRates = createSelector(
  selectCurrencyState,
  (state: any) => state // or `state.exchangeRates` if state contains multiple properties
);
