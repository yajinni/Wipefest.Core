import { SpecializationsService } from '../specializations/specializations.service';
import { RaidFactory } from '../raid/raid';
import { TestDataService } from '../testing/test-data.service';

describe('RaidFactory', () => {
  const testDataService = new TestDataService();

  it('should return a raid', () => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const specializationsService = new SpecializationsService();

    const raid = RaidFactory.Get(
      data.combatEvents.filter(x => x.type === 'combatantinfo'),
      data.report.friendlies.filter(x => x.fights.some(y => y.id === data.fightInfo.id)),
      specializationsService
    );

    expect(raid).toEqual(data.raid);
  });
});
