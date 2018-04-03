import { FightEventService } from './fight-event.service';
import { TestDataService } from '../testing/test-data.service';

describe('FightEventService', () => {
  const testDataService = new TestDataService();

  it('should return fight events', () => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');
    const service = new FightEventService();

    const events = service.getEvents(
      data.report,
      data.fightInfo,
      data.eventConfigs,
      data.combatEvents,
      data.deaths.entries
    );

    // Compare key event properties so test is less brittle
    let eventDtos = events.map(x => x.toDto());
    expect(eventDtos.map(x => x.title)).toEqual(data.eventDtos.map(x => x.title));
    expect(eventDtos.map(x => x.timestamp)).toEqual(data.eventDtos.map(x => x.timestamp));
  });
});
