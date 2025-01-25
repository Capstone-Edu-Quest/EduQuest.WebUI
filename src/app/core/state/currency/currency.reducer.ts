import { createReducer, on } from '@ngrx/store';
import { setExchangeRates } from './currency.action';

export const exchangeRates = null;

export const currencyReducer = createReducer(
  exchangeRates,
  on(setExchangeRates, (state, {rates}) => rates)
);
