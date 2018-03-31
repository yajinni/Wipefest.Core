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

    // Convert to Objects so Jasmine doesn't worry about types not matching
    // (FightEvent !== AbilityEvent etc)
    const actual = JSON.parse(JSON.stringify(events));
    const expected = JSON.parse(JSON.stringify(data.eventDtos));

    expect(actual).toEqual(expected);
  });
});
