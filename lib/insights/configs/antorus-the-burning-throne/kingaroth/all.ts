import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffUnlessRole } from '../../debuff-unless-role';
import { Soak } from '../../soak';

export namespace KingarothInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffUnlessRole('8', 2088, ['Diabolic Bomb'], [181089], 'Tank',`
Non-{role}s triggered {ability:248214:Diabolic Bomb:physical} {totalHits} time{plural}.
      `, null, null, true),
      new DebuffUnlessRole('0', 2088, ['Forging Strike'], [254919], 'Tank', null, null, null, true),
      // Forging Strike > 1 stack

      new Hit('1', 2088, ['Flame Reverberation'], [244328]),
      new Hit('2', 2088, ['Ruiner'], [246840], null, null, null, true),
      new Hit('3', 2088, ['Apocalypse Blast'], [246634]),

      new Soak('4', 2088, ['Annihilation'], [246664]),
      new Hit(
        '5',
        2088,
        ['Annihilation Blast'],
        [246666],
        null,
        '{timestamps}'
      ),
      new Soak('6', 2088, ['Demolish'], [246706]),
      new HitWithoutDebuff(
        '7',
        2088,
        ['Decimation > 2m'],
        [246690],
        ['Decimation'],
        [246687],
        7000, null, null, null, true
      )
    ];
  }
}
