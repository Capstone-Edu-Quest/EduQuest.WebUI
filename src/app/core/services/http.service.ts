import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/enviroments';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  post<T>(endpoint: string, data: T): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<T>(url, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  get<T>(endpoint: string, id?: string): Observable<T> {
    const url = id
      ? `${this.apiUrl}/${endpoint}/${id}`
      : `${this.apiUrl}/${endpoint}`;
    return this.http
      .get<T>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  update<T>(endpoint: string, id: string, data: T): Observable<T> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .put<T>(url, data, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  delete(endpoint: string, id: string): Observable<void> {
    const url = `${this.apiUrl}/${endpoint}/${id}`;
    return this.http
      .delete<void>(url, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error occurred: ', error);
    throw error;
  }
}
