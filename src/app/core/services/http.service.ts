import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseReponse } from '../../shared/interfaces/https.interfaces';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<TPayload>(
    endpoint: string,
    data: any
  ): Observable<BaseReponse<TPayload>> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<BaseReponse<TPayload>>(url, data, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  get<TPayload>(
    endpoint: string,
    id?: string
  ): Observable<BaseReponse<TPayload>> {
    const url = id
      ? `${this.apiUrl}/${endpoint}/${id}`
      : `${this.apiUrl}/${endpoint}`;
    return this.http
      .get<BaseReponse<TPayload>>(url, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  getOutside<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url, { headers: this.getHeaders() })
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  update<TPayload>(
    endpoint: string,
    id: string,
    data: any
  ): Observable<BaseReponse<TPayload>> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .put<BaseReponse<TPayload>>(url, data, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  delete<TPayload>(endpoint: string, id: string): Observable<BaseReponse<any>> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .delete<BaseReponse<any>>(url, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleResponse<TPayload>() {
    return (source$: Observable<BaseReponse<TPayload>>) =>
      source$.pipe(
        switchMap((response) => {
          if (response.isError) {
            return this.handleUserError(response);
          }
          return of(response);
        }),
        catchError((error) => this.handleHttpError(error))
      );
  }

  handleHttpError(error: any): Observable<never> {
    console.error('Error occurred: ', error);
    throw EMPTY;
  }

  private handleUserError<TPayload>(
    payload: BaseReponse<TPayload>
  ): Observable<never> {
    throw EMPTY;
  }
}
