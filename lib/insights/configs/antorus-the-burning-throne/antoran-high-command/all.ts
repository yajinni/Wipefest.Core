import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffDuration } from '../../debuff-duration';
import { Death } from '../../death';
import { HitUnlessRole } from '../../hit-unless-role';
import { Interrupt } from '../../interrupt';
import { PodDuration } from '../../antorus-the-burning-throne/antoran-high-command/pod-duration';
import { FusilladeBeforeFelshield } from '../../antorus-the-burning-throne/antoran-high-command/fusillade-before-felshield';
import { LessThanSixEmittersBeforeErodus } from '../../antorus-the-burning-throne/antoran-high-command/less-than-six-emitters-before-erodus';
import { ClosestHit } from '../../closest-hit';

export namespace AntoranHighCommandInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new HitUnlessRole(
        '0',
        2070,
        ['Exploit Weakness'],
        [244892],
        'Tank',
        null,
        null,
        `
Whichever boss is active will periodically cast {ability:244892:Exploit Weakness:physical},
which deals a high amount of physical damage and increases physical damage taken for 20 seconds.
Only tanks should get hit by this, and they should swap on the debuff.`, true
      ),

      new ClosestHit(
        '1',
        2070,
        ['Entropic Mines'],
        [245121],
        ['Entropic Mine'],
        null,
        null,
        `
While ${MarkupHelper.Style('boss', 'Chief Engineer Ishkar')} is in his pod,
he will cast {ability:245161:Entropic Mine:physical}, spawning mines near players.
The raid should avoid these mines, moving around the room to safe areas if necessary.
These mines explode naturally after 3:45, so it is a good idea to gradually clear them to control the damage.
Safely explode 2 or 3 at a time, and then allow time for the DoT to drop off before exploding more.`
      ),

      new Interrupt(
        '2',
        2070,
        ['Pyroblast'],
        [246505],
        null,
        null,
        `
While ${MarkupHelper.Style('boss', 'General Erodus')} is in his pod,
he will cast {ability:245546:Summon Reinforcements:physical}, spawning
${MarkupHelper.Style('npc', 'Felblade Shocktrooper')}s and ${MarkupHelper.Style(
          'npc',
          'Fanatical Pyromancer'
        )}s.
${MarkupHelper.Style(
          'npc',
          'Fanatical Pyromancer'
        )}s cast {ability:246505:Pyroblast:fire},
which deals large single-target damage to a player if not interrupted.`
      ),

      new PodDuration('3'),

      new DebuffDuration(
        '8',
        2070,
        'Chaos Pulse',
        'Chaos Pulse (Removed)',
        0,
        null,
        null,
        `
Players inside of pods are granted extra abilities.
Their first ability applies {ability:244420:Chaos Pulse:fire} to an enemy.
This should be constantly used on the currently active boss.
{ability:244420:Chaos Pulse:fire} stacks up to 15 times, increasing the bosses damage taken by 15%.
This damage taken increase is crucial for meeting the damage requirement of this encounter.
The debuff lasts for 6 seconds, so can be kept at full stacks even when a new player is entering a pod.`, true
      ),

      new Death(
        '4',
        2070,
        [244172],
        null,
        null,
        `
When a player enters a pod, they gain {ability:244172:Psychic Assault:shadow},
which deals increasing ticking damage while they are inside.
Healers should do their best to keep pod players alive,
and pod players should watch their health, being sure to exit the pod before they die.`, true
      ),

      new LessThanSixEmittersBeforeErodus('5'),

      new FusilladeBeforeFelshield('6'),

      new HitWithoutDebuff(
        '7',
        2070,
        ['Shocked'],
        [244748],
        ['Shock Grenade'],
        [244737],
        9000,
        null,
        null,
        `
Every 15 to 20 seconds, 3 players will be afflicted with {ability:244737:Shock Grenade:fire}.
5 seconds later, these players will explode, dealing damage and stunning players within 8 yards.
Players with {ability:244737:Shock Grenade:fire} should find a safe position, where they won't hit anyone else when they explode.`, true
      )
    ];
  }
}
