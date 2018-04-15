import { Report } from '../reports/report';
import { Observable } from 'rxjs/Observable';
import { HttpResult } from 'infrastructure/result';

export interface IReportService {
  getReport(reportId: string): Observable<HttpResult<Report>>;
}
