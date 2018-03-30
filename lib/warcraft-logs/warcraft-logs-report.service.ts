import { Observable } from 'rxjs/Observable';
import { Report } from '../reports/report';
import { IReportService } from '../reports/report.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/fromPromise';
import { AxiosInstance, AxiosResponse } from 'axios';

export class WarcraftLogsReportService implements IReportService {
  constructor(private http: AxiosInstance, private apiKey: string) {}

  private get<T>(url: string, params: any): Observable<AxiosResponse<T>> {
    return Observable.fromPromise(
      this.http.get<T>(url, {
        params: params
      })
    );
  }

  getReport(reportId: string): Observable<Report> {
    return this.get<any>(`/report/fights/${reportId}`, {
      api_key: this.apiKey,
      random: this.getRandomString()
    })
      .map(response => {
        const report = Object.create(Report.prototype);
        Object.assign(report, response.data);
        report.id = reportId;

        return report;
      })
      .catch(error => this.handleError(error));
  }

  private handleError(error: Response | any): Observable<Response> {
    return Observable.throw(error);
  }

  private getRandomString() {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let output = '';
    for (let i = 0; i < 12; i++) {
      output += characters[this.getRandomNumber(characters.length) - 1];
    }
    return output;
  }

  private getRandomNumber(max: number) {
    return Math.floor(Math.random() * (max + 0.999999));
  }
}
