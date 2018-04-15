import { WarcraftLogsDeathService } from './warcraft-logs-death.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OkHttpResult, ErrorHttpResult } from 'infrastructure/result';
import { Death } from 'deaths/death';
import { Report, FightInfo } from 'reports/report';

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

    service.getDeaths(data.report, data.fightInfo).subscribe(result => {
      expect(result).toEqual(
        new OkHttpResult<Death[]>(200, data.deaths.entries)
      );
      done();
    });
  });

  it('should handle not found', done => {
    shouldHandleError(done, 404, 'Deaths were not found.');
  });

  it('should handle bad request', done => {
    shouldHandleError(done, 400, 'The supplied parameters were incorrect.');
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

    const service = new WarcraftLogsDeathService(http, apiKey);

    service
      .getDeaths(<Report>{ id: '' }, <FightInfo>{ start_time: 0, end_time: 0 })
      .subscribe(result => {
        expect(result).toEqual(new ErrorHttpResult<Death[]>(status, message));
        done();
      });
  }
});
