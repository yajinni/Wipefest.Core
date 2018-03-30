import { WarcraftLogsCombatEventService } from './warcraft-logs-combat-event.service';
import { EventConfigService } from '../event-configs/event-config.service';
import { EncountersService } from '../encounters/encounters.service';
import { SpecializationsService } from '../specializations/specializations.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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
      .subscribe(combatEvents => {
        expect(combatEvents).toEqual(data.combatEvents);
        done();
      });
  });
});
