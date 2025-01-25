import { createAction, props } from '@ngrx/store';

export const setExchangeRates = createAction('currency.add', props<{ rates: any }>());