import { Report } from '../reports/report';
import { Observable } from 'rxjs/Observable';

export interface IReportService {
  getReport(reportId: string): Observable<Report>;
}
