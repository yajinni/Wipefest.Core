import { InsightConfig } from '../../insight-config';
import { DebuffDuration } from '../../debuff-duration';
import { Debuff } from '../../debuff';
import { Hit } from '../../hit';
import { Spawn } from '../../spawn';

export namespace DemonicInquisitionInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffDuration(
        '0',
        2048,
        'Echoing Anguish',
        'Echoing Anguish (Removed)',
        4500
      ),
      new Debuff('1', 2048, ['Unbearable Torment'], [233430]),
      new DebuffDuration(
        '2',
        2048,
        'Soul Corruption',
        'Soul Corruption (Removed)',
        20000,
        'Stayed inside for an average duration of {averageDuration}, with {totalFrequencyOverThreshold} times lasting longer than {threshold}.'
      ),
      new Spawn('3', 2048, 'Tormented Fragment'),
      new Hit('4', 2048, ['Explosive Anguish'], [241524])
    ];
  }
}
