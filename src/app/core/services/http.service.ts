import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseReponse } from '../../shared/interfaces/https.interfaces';

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
      .pipe(
        map((response: any) => {
          if (response.isError) {
            throw response;
          }
          return response;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  get<TPayload>(
    endpoint: string,
    id?: string
  ): Observable<BaseReponse<TPayload>> {
    const url = id
      ? `${this.apiUrl}/${endpoint}/${id}`
      : `${this.apiUrl}/${endpoint}`;
    return this.http.get<TPayload>(url, { headers: this.getHeaders() }).pipe(
      map((response: any) => {
        if (response.isError) {
          throw response;
        }
        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  getOutside<T>(url: string): Observable<T> {
    return this.http
      .get<T>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update<TPayload>(
    endpoint: string,
    id: string,
    data: any
  ): Observable<BaseReponse<TPayload>> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .put<TPayload>(url, data, { headers: this.getHeaders() })
      .pipe(
        map((response: any) => {
          if (response.isError) {
            throw response;
          }
          return response;
        }),
        catchError((error) => this.handleError(error))
      );
  }

  delete<TPayload>(
    endpoint: string,
    id: string
  ): Observable<BaseReponse<TPayload>> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() }).pipe(
      map((response: any) => {
        if (response.isError) {
          throw response;
        }
        return response;
      }),
      catchError((error) => this.handleError(error))
    );
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  handleError(error: any): Observable<never> {
    console.error('Error occurred: ', error);
    throw error;
  }
}
