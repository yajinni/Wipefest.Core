import { WarcraftLogsCombatEventService } from './warcraft-logs-combat-event.service';
import { EventConfigService } from '../event-configs/event-config.service';
import { EncountersService } from '../encounters/encounters.service';
import { SpecializationsService } from '../specializations/specializations.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OkHttpResult, ErrorHttpResult } from 'infrastructure/result';
import { FightInfo, Report } from 'reports/report';

describe('WarcraftLogsCombatEventService', () => {
  const url = 'URL';
  const apiKey = 'WCL_API_KEY';
  const testDataService = new TestDataService();

  it('should return combat events', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    new MockAdapter(http)
      .onGet(`/report/events/${data.report.id}`, {
        params: {
          api_key: apiKey,
          start: data.fightInfo.start_time,
          end: data.fightInfo.end_time,
          filter: data.query
        }
      })
      .reply(200, data.combatEventPages[0])
      .onGet(`/report/events/${data.report.id}`, {
        params: {
          api_key: apiKey,
          start: data.combatEventPages[0].nextPageTimestamp,
          end: data.fightInfo.end_time,
          filter: data.query
        }
      })
      .reply(200, data.combatEventPages[1])
      .onGet(`/report/events/${data.report.id}`, {
        params: {
          api_key: apiKey,
          start: data.combatEventPages[1].nextPageTimestamp,
          end: data.fightInfo.end_time,
          filter: data.query
        }
      })
      .reply(200, data.combatEventPages[2]);

    const encountersService = new EncountersService();
    const specializationsService = new SpecializationsService();
    const eventConfigService = new EventConfigService(
      encountersService,
      specializationsService,
      http
    );
    const combatEventService = new WarcraftLogsCombatEventService(
      eventConfigService,
      http,
      apiKey
    );

    combatEventService
      .getCombatEvents(data.report, data.fightInfo, data.eventConfigs)
      .subscribe(result => {
        expect(result).toEqual(new OkHttpResult(200, data.combatEvents));
        done();
      });
  });

  it('should handle not found', done => {
    shouldHandleError(done, 404, 'Combat events were not found.');
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

    const service = new WarcraftLogsCombatEventService(
      new EventConfigService(null, null, null),
      http,
      apiKey
    );

    service
      .getCombatEvents(
        <Report>{ id: '' },
        <FightInfo>{ start_time: 0, end_time: 0 },
        []
      )
      .subscribe(result => {
        expect(result).toEqual(new ErrorHttpResult(status, message));
        done();
      });
  }
});
