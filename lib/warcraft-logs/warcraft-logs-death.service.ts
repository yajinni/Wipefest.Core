import { Death } from '../deaths/death';
import { Observable } from 'rxjs/Observable';
import { IDeathService } from '../deaths/death.service';
import { FightInfo, Report } from '../reports/report';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AxiosInstance, AxiosResponse } from 'axios';
import { HttpService } from 'infrastructure/http.service';
import { OkHttpResult, HttpResult } from 'infrastructure/result';

export class WarcraftLogsDeathService extends HttpService
  implements IDeathService {
  constructor(http: AxiosInstance, private apiKey: string) {
    super(http);
  }

  getDeaths(report: Report, fight: FightInfo): Observable<HttpResult<Death[]>> {
    return this.get(`report/tables/deaths/${report.id}`, {
      api_key: this.apiKey,
      start: fight.start_time,
      end: fight.end_time
    })
      .map(response => {
        const deaths = response.data.entries.map(x => {
          const death = Object.create(Death.prototype);
          Object.assign(death, x);
          return death;
        });

        return new OkHttpResult<Death[]>(response.status, deaths);
      })
      .catch(error => this.handleError<Death[]>(error));
  }
}
