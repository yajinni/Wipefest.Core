import { Observable } from 'rxjs/Observable';
import { Report } from '../reports/report';
import { IReportService } from '../reports/report.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AxiosInstance, AxiosResponse } from 'axios';
import {
  HttpResult,
  OkHttpResult,
  ErrorHttpResult
} from 'infrastructure/result';
import { HttpService } from 'infrastructure/http.service';

export class WarcraftLogsReportService extends HttpService
  implements IReportService {
  constructor(http: AxiosInstance, private apiKey: string) {
    super(http);
  }

  getReport(reportId: string): Observable<HttpResult<Report>> {
    return this.get(`/report/fights/${reportId}`, {
      api_key: this.apiKey,
      random: this.getRandomString()
    })
      .map(response => {
        const report = Object.create(Report.prototype);
        Object.assign(report, response.data);
        report.id = reportId;

        return new OkHttpResult<Report>(response.status, report);
      })
      .catch(error => this.handleError<Report>(error));
  }

  private getRandomString(): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let output = '';
    for (let i = 0; i < 12; i++) {
      output += characters[this.getRandomNumber(characters.length) - 1];
    }
    return output;
  }

  private getRandomNumber(max: number): number {
    return Math.floor(Math.random() * (max + 0.999999));
  }
}
