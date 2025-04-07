import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { BaseReponse } from '../../shared/interfaces/https.interfaces';
import { EMPTY } from 'rxjs';
import { LoadingService } from './loading.service';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';
import { TokenEnum } from 'src/app/shared/enums/localStorage.enum';
import { StorageService } from './storage.service';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private loading: LoadingService,
    private message: MessageService,
    private translate: TranslateService,
    private storage: StorageService
  ) {}

  post<TPayload>(
    endpoint: string,
    data: any
  ): Observable<BaseReponse<TPayload> | undefined> {
    this.loading.addLoading();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<BaseReponse<TPayload>>(url, data, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  upload<TPayload>(
    endpoint: string,
    data: any
  ): Observable<BaseReponse<TPayload> | undefined> {
    this.loading.addLoading();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .post<BaseReponse<TPayload>>(url, data, { headers: this.getFormDataHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  get<TPayload>(
    endpoint: string
  ): Observable<BaseReponse<TPayload> | undefined> {
    this.loading.addLoading();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .get<BaseReponse<TPayload>>(url, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  // getOutside<T>(url: string): Observable<T> | undefined {
  //   this.loading.addLoading();
  //   return this.http.get<T>(url, { headers: this.getHeaders() }).pipe(
  //     catchError((error) => this.handleHttpError(error)),
  //     finalize(() => this.loading.removeLoading())
  //   );
  // }

  update<TPayload>(
    endpoint: string,
    data: any,
  ): Observable<BaseReponse<TPayload> | undefined> {
    this.loading.addLoading();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .put<BaseReponse<TPayload>>(url, data, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  delete<TPayload>(
    endpoint: string,
  ): Observable<BaseReponse<any> | undefined> {
    this.loading.addLoading();
    const url = `${this.apiUrl}/${endpoint}`;
    return this.http
      .delete<BaseReponse<any>>(url, { headers: this.getHeaders() })
      .pipe(this.handleResponse<TPayload>());
  }

  private getHeaders(): any {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.storage.getCookie(TokenEnum.ACCESS_TOKEN)}`,
    };
  }

  private getFormDataHeaders(): any {
    return {
      Authorization: `Bearer ${this.storage.getCookie(TokenEnum.ACCESS_TOKEN)}`,
    };
  }

  private handleResponse<TPayload>() {
    return (source$: Observable<BaseReponse<TPayload>>) =>
      source$.pipe(
        switchMap((response) => {
          if (response.isError) {
            return this.handleUserError(response); // Ensure this returns an observable
          }
          return of(response); // Continue the observable chain
        }),
        catchError((error) => of(this.handleHttpError(error?.error))), // Handle error and return undefined
        finalize(() => {
          this.loading.removeLoading();
        })
      );
  }

  handleHttpError(error: any) {
    console.error('Error occurred: ', error);
    switch (error.errors.statusCode ?? error.code) {
      case 401:
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.UNAUTHORIZED')
        );
        break;
      case 403:
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.NO_PERMISSION')
        );
        break;
      case 404:
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.NOT_FOUND')
        );
        break;
      case 500:
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.INTERNAL_SERVER_ERROR')
        );
        break;
      default:
        this.message.addMessage(
          'error',
          this.translate.instant('MESSAGE.' + (error?.message?.content ?? ''), error?.message?.values ?? {})
        );
        break;
    }

    return undefined; // Ensure a value is returned
  }

  private handleUserError<TPayload>(payload: BaseReponse<TPayload>) {
    if (payload.isError) {
      this.message.addMessage(
        'error',
        this.translate.instant(
          `MESSAGE.${payload.message?.content}`,
          payload.message?.values
        )
      );
    }
    this.loading.removeLoading();
    return of(undefined);
  }
}
