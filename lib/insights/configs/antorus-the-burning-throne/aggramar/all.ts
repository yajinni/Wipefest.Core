import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { Hit } from '../../hit';
import { Debuff } from '../../debuff';
import { DebuffUnlessRole } from '../../debuff-unless-role';
import { DebuffDuration } from '../../debuff-duration';
import { PhaseDuration } from '../../phase-duration';

export namespace AggramarInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      // Taeshalach's Reach 245990 stacks too high
      // Flame Rend 244033 non-tank ability target
      new DebuffUnlessRole('0', 2063, ["Taeshalach's Reach"], [245990], 'Tank', null, null, null, true),
      new DebuffUnlessRole('1', 2063, ['Foe Breaker'], [244291], 'Tank', null, null, null, true),
      new Debuff(
        '2',
        2063,
        ['Burning Rage'],
        [244713],
        `${MarkupHelper.Style(
          'boss',
          'Aggramar'
        )} gained {abilities} {totalHits} time{plural}.`,
        '{abilitiesAndTimestamps}'
      ),
      new Debuff('3', 2063, ['Wake of Flame'], [244736], null, null, null, true),

      new Hit('4', 2063, ['Flare'], [245391], null, null, null, true),
      new Hit('5', 2063, ['Empowered Flare'], [245392], null, null, null, true),
      new Hit('6', 2063, ['Meteor Swarm'], [244686], null, null, null, true),

      new PhaseDuration(
        '7',
        2063,
        'Intermission 1',
        'Had an {phase} duration of {averageDuration}.',
        ''
      ),
      new PhaseDuration(
        '8',
        2063,
        'Intermission 2',
        'Had an {phase} duration of {averageDuration}.',
        ''
      ),
      new Hit('9', 2063, ['Corrupt Aegis'], [254022]),
      new DebuffDuration(
        'A',
        2063,
        'Catalyzing Presence',
        'Catalyzing Presence (Removed)',
        null,
        'Had a total {ability} duration of {totalDuration}.'
      ),
      new Debuff('B', 2063, ['Molten Remnants'], [245916])
    ];
  }
}
