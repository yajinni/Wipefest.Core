import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { Interrupt } from '../../interrupt';
import { HitUnlessRole } from '../../hit-unless-role';
import { ParaxisTeams } from './paraxis-teams';

export namespace TheDefenseOfEonarInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new ParaxisTeams('0'),
      new HitWithoutDebuff(
        '1',
        2075,
        ['Rain of Fel'],
        [248329],
        ['Rain of Fel'],
        [248332],
        6000,
        null,
        null,
        `
{npc:The Paraxis} will target several people with {ability:248332:Rain of Fel:physical},
which fires missiles that land on those players 5 seconds later,
dealing damage to that player and all players within 8 yards.
Targeted players should move away to avoid allies being hit by unnecessary damage.`
      ),
      new Hit(
        '2',
        2075,
        ['Fel Wake'],
        [248795],
        `
Stood in {abilities} {totalHits} time{plural}.`,
        null,
        `
{npc:The Paraxis} will fire fel beams at the platforms, that burn a trail of green {ability:248795:Fel Wakes:fire}.
Players stood in these {ability:248795:Fel Wakes:fire} will take damage, so they should be avoided.`
      ),
      new HitUnlessRole(
        '3',
        2075,
        ['Fel Swipe'],
        [250703],
        'Tank',
        null,
        null,
        `
{npc:Fel-Powered Purifiers} will cast {ability:250703:Fel Swipe:fire},
which deals large damage to all players in front of them.
There is a 2 second cast time to {ability:250703:Fel Swipe:fire},
and non-tanks should ensure that they are not in front of the {npc:Fel-Powered Purifier}
when it swipes.`
      ),
      new Interrupt(
        '4',
        2075,
        ['Artillery Strike'],
        [246305],
        null,
        null,
        `
{npc:Fel-Infused Destructors} will cast {ability:246305:Artillery Strike:fire},
which deals damage to {npc:Eonar} (about 2% of her health on Heroic, and about 5% on Mythic).
These casts are interruptible, so should be interrupted to prevent {npc:Eonar} from dying.`
      )
    ];
  }
}
