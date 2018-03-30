import { Death } from '../deaths/death';
import { Observable } from 'rxjs/Observable';
import { IDeathService } from '../deaths/death.service';
import { FightInfo, Report } from '../reports/report';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import { AxiosInstance, AxiosResponse } from 'axios';

export class WarcraftLogsDeathService implements IDeathService {
  constructor(private http: AxiosInstance, private apiKey: string) {}

  private get<T>(url: string, params: any): Observable<AxiosResponse<T>> {
    return Observable.fromPromise(
      this.http.get<T>(url, {
        params: params
      })
    );
  }

  getDeaths(report: Report, fight: FightInfo): Observable<Death[]> {
    return this.get<any>(`report/tables/deaths/${report.id}`, {
      api_key: this.apiKey,
      start: fight.start_time,
      end: fight.end_time
    })
      .map(response =>
        response.data.entries.map(x => {
          const death = Object.create(Death.prototype);
          Object.assign(death, x);
          return death;
        })
      )
      .catch(error => this.handleError(error));
  }

  private handleError(error: Response | any): Observable<Response> {
    return Observable.throw(error);
  }
}
