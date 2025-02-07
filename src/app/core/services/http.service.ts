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

  post<TResponse>(
    endpoint: string,
    data: any
  ): Observable<BaseReponse<TResponse>> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<BaseReponse<TResponse>>(url, data, { headers: this.getHeaders() })
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

  get<TResponse>(
    endpoint: string,
    id?: string
  ): Observable<BaseReponse<TResponse>> {
    const url = id
      ? `${this.apiUrl}/${endpoint}/${id}`
      : `${this.apiUrl}/${endpoint}`;
    return this.http.get<TResponse>(url, { headers: this.getHeaders() }).pipe(
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

  update<TResponse>(
    endpoint: string,
    id: string,
    data: any
  ): Observable<BaseReponse<TResponse>> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .put<TResponse>(url, data, { headers: this.getHeaders() })
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

  delete<TResponse>(
    endpoint: string,
    id: string
  ): Observable<BaseReponse<TResponse>> {
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
