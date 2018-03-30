import { InsightConfig } from '../../insight-config';
import { Death } from '../../death';
import { Hit } from '../../hit';
import { Cast } from '../../cast';
import { HitHard } from '../../hit-hard';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { WeaponDestroyedFirst } from '../../antorus-the-burning-throne/garothi-worldbreaker/weapon-destroyed-first';
import { Soak } from '../../soak';

export namespace GarothiWorldbreakerInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      //Hit by Fel Bombardment
      //Hit by Decimation > 2m
      //Carnage casts
      //Big Eradication hits
      //Didn't soak Annihilation
      //Killed Annhilator/Decimator first

      new WeaponDestroyedFirst('0'),
      new Hit(
        '1',
        2076,
        ['Fel Bombardment'],
        [244532],
        null,
        null,
        `
${MarkupHelper.Style(
          'boss',
          'Garothi Worldbreaker'
        )} debuffs the current tank with {ability:244532:Fel Bombardment:fire}.
When this debuff expires, ${MarkupHelper.Style(
          'boss',
          'Garothi Worldbreaker'
        )} fires missiles at the tank's position.
To avoid these missiles, the tank should move away from the boss when they have the debuff,
and then be running when the debuff expires.
Other players should stay away from the tank to avoid being hit by these missiles.`
      ),
      new Hit(
        '2',
        2076,
        ['Decimation > 2m'],
        [244449],
        'Failed to move out of {abilities} {totalHits} time{plural}.',
        null,
        `
When the ${MarkupHelper.Style(
          'npc',
          'Decimator'
        )} weapon is active, it casts {ability:244449:Decimation:fire},
which creates large circles on the ground that players should move out of.
When {ability:244449:Decimation:fire} hits,
the raid takes minor damage, and players inside of these circles take major damage.`
      ),
      new Cast(
        '3',
        2076,
        ['Carnage'],
        [244106],
        null,
        null,
        `
If no player is within melee range of ${MarkupHelper.Style(
          'boss',
          'Garothi Worldbreaker'
        )},
then he casts {ability:244106:Carnage:fire}, dealing raid-wide damage.
Make sure to always have one tank within melee range,
particularly right after {ability:244969:Eradication:physical},
when the raid has moved away from the boss.`
      ),
      new HitHard(
        '4',
        2076,
        ['Eradication'],
        [244969],
        2500000,
        null,
        null,
        `
At the end of ${MarkupHelper.Info('Phase 2')},
${MarkupHelper.Style(
          'boss',
          'Garothi Worldbreaker'
        )} will cast {ability:244969:Eradication:physical},
which deals more damage the closer you are to him.
Make sure to move away from the boss to reduce this damage.`
      ),
      new Death(
        '5',
        2076,
        [244969],
        null,
        null,
        `
At the end of ${MarkupHelper.Info('Phase 2')},
${MarkupHelper.Style(
          'boss',
          'Garothi Worldbreaker'
        )} will cast {ability:244969:Eradication:physical},
which deals more damage the closer you are to him.
Make sure to move away from the boss to reduce this damage.`
      ),
      new Soak(
        '6',
        2076,
        ['Annihilation', 'Shrapnel'],
        [244761, 247044],
        null,
        null,
        `
When the ${MarkupHelper.Style(
          'npc',
          'Annihilator'
        )} weapon is active, it casts {ability:244761:Annihilation:fire},
which creates small circles on the ground that need to be soaked.
The damage from {ability:244761:Annihilation:fire} will be split across soakers,
but will deal large raid-wide damage if any circles are not soaked.
{ability:244761:Annihilation:fire} leaves no debuff, so try to soak as many as you can!`
      )
    ];
  }
}
