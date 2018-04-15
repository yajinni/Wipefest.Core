import { WarcraftLogsReportService } from './warcraft-logs-report.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OkHttpResult, ErrorHttpResult } from 'infrastructure/result';
import { Report } from 'reports/report';

describe('WarcraftLogsReportService', () => {
  const url = 'URL';
  const apiKey = 'WCL_API_KEY';
  const testDataService = new TestDataService();

  it('should return a report', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    new MockAdapter(http)
      .onAny(`/report/fights/${data.report.id}`)
      .reply(200, data.report);

    const service = new WarcraftLogsReportService(http, apiKey);

    service.getReport(data.report.id).subscribe(result => {
      expect(result).toEqual(new OkHttpResult<Report>(200, data.report));
      done();
    });
  });

  it('should handle not found', done => {
    shouldHandleError(done, 404, 'This report does not exist');
  });

  it('should handle bad request', done => {
    shouldHandleError(done, 400, 'This report does not exist or is private.');
  });

  it('should handle too many requests', done => {
    shouldHandleError(done, 429, 'You have reached your rate limit.');
  });

  it('should handle server error', done => {
    shouldHandleError(done, 500, 'An error has occurred.');
  });

  function shouldHandleError(
    done: DoneFn,
    status: number,
    message: string
  ): void {
    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    new MockAdapter(http).onAny().reply(status, message);

    const service = new WarcraftLogsReportService(http, apiKey);

    service.getReport('').subscribe(result => {
      expect(result).toEqual(new ErrorHttpResult<Report>(status, message));
      done();
    });
  }
});
