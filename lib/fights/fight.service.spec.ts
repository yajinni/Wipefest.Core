import { WarcraftLogsCombatEventService } from '../warcraft-logs/warcraft-logs-combat-event.service';
import { EventConfigService } from '../event-configs/event-config.service';
import { EncountersService } from '../encounters/encounters.service';
import { SpecializationsService } from '../specializations/specializations.service';
import { FightService } from '../fights/fight.service';
import { WarcraftLogsDeathService } from '../warcraft-logs/warcraft-logs-death.service';
import { FightEventService } from '../fight-events/fight-event.service';
import { InsightService } from '../insights/insight.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('FightService', () => {
  const url = 'URL';
  const apiKey = 'WCL_API_KEY';
  const testDataService = new TestDataService();

  it('should return a fight', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create();

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
      .reply(200, data.combatEventPages[2])
      .onGet(`/report/tables/deaths/${data.report.id}`, {
        params: {
          api_key: apiKey,
          start: data.fightInfo.start_time,
          end: data.fightInfo.end_time
        }
      })
      .reply(200, data.deaths);

    const encountersService = new EncountersService();
    const specializationsService = new SpecializationsService();
    const eventConfigService = new EventConfigService(
      encountersService,
      specializationsService,
      http
    );
    const deathService = new WarcraftLogsDeathService(http, apiKey);
    const combatEventService = new WarcraftLogsCombatEventService(
      eventConfigService,
      http,
      apiKey
    );
    const fightEventService = new FightEventService();
    const insightService = new InsightService();
    const fightService = new FightService(
      deathService,
      combatEventService,
      fightEventService,
      specializationsService,
      insightService
    );

    fightService
      .getFight(data.report, data.fightInfo, data.eventConfigs)
      .subscribe(fight => {
        expect(fight.report).toEqual(data.report);
        expect(fight.info).toEqual(data.fightInfo);
        expect(fight.eventConfigs).toEqual(data.eventConfigs);
        expect(fight.raid).toEqual(data.raid);
        expect(fight.insights).toEqual(data.insights);

        // Convert to Objects so Jasmine doesn't worry about types not matching
        // (FightEvent !== AbilityEvent etc)
        expect(JSON.parse(JSON.stringify(fight.events))).toEqual(
          JSON.parse(JSON.stringify(data.eventDtos))
        );
        done();
      });
  });
});
