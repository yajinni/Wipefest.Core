import { WarcraftLogsDeathService } from './warcraft-logs-death.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('WarcraftLogsDeathService', () => {
  const url = 'URL';
  const apiKey = 'WCL_API_KEY';
  const testDataService = new TestDataService();

  it('should return deaths', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    new MockAdapter(http)
      .onGet(`/report/tables/deaths/${data.report.id}`, {
        params: {
          api_key: apiKey,
          start: data.fightInfo.start_time,
          end: data.fightInfo.end_time
        }
      })
      .reply(200, data.deaths);

    const service = new WarcraftLogsDeathService(http, apiKey);

    service.getDeaths(data.report, data.fightInfo).subscribe(deaths => {
      expect(deaths).toEqual(data.deaths.entries);
      done();
    });
  });
});
