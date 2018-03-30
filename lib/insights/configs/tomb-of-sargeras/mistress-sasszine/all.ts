import { InsightConfig } from '../../insight-config';
import { Death } from '../../death';
import { DebuffDuration } from '../../debuff-duration';
import { Debuff } from '../../debuff';

export namespace MistressSasszineInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffDuration(
        '0',
        2037,
        'Delicious Bufferfish',
        'Delicious Bufferfish (Removed)',
        25000
      ),
      new Death('1', 2037, [239436]),
      new Death('2', 2037, [232885]),
      new Death('3', 2037, [232827]),
      new DebuffDuration(
        '4',
        2037,
        'Consuming Hunger',
        'Consuming Hunger (Removed)',
        30000
      ),
      new DebuffDuration(
        '5',
        2037,
        'Thundering Shock',
        'Thundering Shock (Removed)',
        1500
      ),
      new Debuff('6', 2037, ['Slicing Tornado'], [232732])
    ];
  }
}
