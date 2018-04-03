import { InsightService } from './insight.service';
import { InsightContext } from './models/insight-context';
import { TestDataService } from '../testing/test-data.service';

describe('InsightService', () => {
  const testDataService = new TestDataService();

  it('should return insights', () => {
    const data = testDataService.get('xyMd2kwb3W9zNrJF-13');

    const context = new InsightContext(
      data.report,
      data.fightInfo,
      data.raid,
      data.events
    );

    const service = new InsightService();

    const insights = service.getInsights(data.fightInfo.boss, context);

    // Compare key insight properties so test is less brittle
    expect(insights.map(x => x.title)).toEqual(data.insights.map(x => x.title));
    expect(insights.map(x => x.details)).toEqual(data.insights.map(x => x.details));
    expect(insights.map(x => x.tip)).toEqual(data.insights.map(x => x.tip));
  });
});
