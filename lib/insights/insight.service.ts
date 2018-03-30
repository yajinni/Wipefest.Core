import { InsightConfig } from '../insights/configs/insight-config';
import { InsightContext } from '../insights/models/insight-context';
import { TombOfSargerasInsightConfigs } from '../insights/configs/tomb-of-sargeras/all';
import { AntorusTheBurningThroneInsightConfigs } from '../insights/configs/antorus-the-burning-throne/all';
import { Insight } from '../insights/models/insight';

export class InsightService {
  constructor() {}

  private getInsightConfigs(): InsightConfig[] {
    return [
      ...TombOfSargerasInsightConfigs.All(),
      ...AntorusTheBurningThroneInsightConfigs.All()
    ];
  }

  getInsights(boss: number, context: InsightContext): Insight[] {
    return this.getInsightConfigs()
      .filter(x => x.boss === boss)
      .map(x => x.getInsight(context))
      .filter(x => x !== null);
  }
}
