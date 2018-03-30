import { WarcraftLogsReportService } from './warcraft-logs-report.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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

    service.getReport(data.report.id).subscribe(report => {
      expect(report).toEqual(data.report);
      done();
    });
  });
});
