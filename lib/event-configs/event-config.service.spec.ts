import { EventConfigService } from './event-config.service';
import { TestDataService } from '../testing/test-data.service';
import * as axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { OkHttpResult, ErrorHttpResult } from 'infrastructure/result';
import { EncountersService } from 'encounters/encounters.service';
import { SpecializationsService } from 'specializations/specializations.service';
import { EventConfig } from 'event-configs/event-config';

describe('EventConfigService', () => {
  const url = 'URL';
  const testDataService = new TestDataService();

  it('should return event configs for includes', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    const mock = new MockAdapter(http);
    const files = data.eventConfigs
      .map(x => x.eventType) // Don't have "file" in test data but pretend they are split by eventType
      .filter((x, index, array) => array.indexOf(x) === index);

    files.forEach(file => {
      mock
        .onAny(file + '.json')
        .reply(200, data.eventConfigs.filter(x => x.eventType === file));
    });

    const service = new EventConfigService(
      new EncountersService(),
      new SpecializationsService(),
      http
    );

    service.getEventConfigs(files).subscribe(result => {
      expect(typeof result).toBe(
        typeof new OkHttpResult<EventConfig[]>(null, null)
      );
      expect(result.status).toEqual(200);
      expect(result.value.length).toEqual(data.eventConfigs.length);
      done();
    });
  });

  it('should return includes for a boss', done => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const http = axios.default.create({
      baseURL: url,
      headers: {}
    });

    new MockAdapter(http).onAny('index.json').reply(200, data.eventConfigIndex);

    const service = new EventConfigService(
      new EncountersService(),
      new SpecializationsService(),
      http
    );

    service.getIncludesForBoss(2070).subscribe(result => {
      expect(result).toEqual(new OkHttpResult<string[]>(200, data.eventConfigIndex.find(x => x.id === 2070).includes));
      done();
    });
  });

  it('should handle not found', done => {
    shouldHandleError(done, 404, 'These event configs do not exist');
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

    const service = new EventConfigService(
      new EncountersService(),
      new SpecializationsService(),
      http
    );

    service.getEventConfigs(['']).subscribe(result => {
      expect(result).toEqual(
        new ErrorHttpResult<EventConfig[]>(status, message)
      );
      done();
    });
  }
});
