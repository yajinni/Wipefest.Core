import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/of';
import { AxiosResponse, AxiosInstance } from 'axios';
import { ErrorHttpResult } from 'infrastructure/result';

export abstract class HttpService {
  constructor(protected http: AxiosInstance) {}

  protected get(url: string, params: any): Observable<AxiosResponse<any>> {
    return Observable.fromPromise(
      this.http.get(url, {
        params: params
      })
    );
  }

  protected handleError<T>(error: any): Observable<ErrorHttpResult<T>> {
    return Observable.of(
      new ErrorHttpResult<T>(
        error.response.status,
        error.response.data ? error.response.data : error.message
      )
    );
  }
}
