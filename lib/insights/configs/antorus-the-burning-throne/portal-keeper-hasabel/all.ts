import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { DebuffDuration } from '../../debuff-duration';
import { Interrupt } from '../../interrupt';

export namespace PortalKeeperHasabelInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      // Average number of stacks when Reality Tear expires
      // Catastrophic Implosion casts (no one on platform)
      // If heroic: Don't get Caustic Slime debuff or Caustic Detonation damage
      // If heroic: Don't get Cloying Shadows debuff or Hungering Gloom damage

      new Hit(
        '0',
        2064,
        ['Collapsing World > 3m'],
        [243984],
        `Stood in {abilities} {totalHits} time{plural}.`,
        null,
        `
{npc:Portal Keeper Hasabel} casts {ability:243984:Collapsing World:shadow} periodically,
spawning a large black circle at her location.
When she finishes casting, all players take small damage, and players stood within the circle take huge damage.
Position {npc:Portal Keeper Hasabel} at the edge of the main platform, between two portals,
and move her whenever she casts {ability:243984:Collapsing World:shadow}.`, true
      ),
      new Hit(
        '1',
        2064,
        ['Felstorm Barrage'],
        [244001],
        null,
        null,
        `
{ability:244001:Felstorm Barrage:fire} spawns several wide green lines across the main platform.
Shortly after each line shows, players stood in it will be barraged for huge damage.
Lines spawn one after another at different angles, but always go through the center of the platform.`, true
      ),
      new Interrupt(
        '2',
        2064,
        ['Fiery Detonation'],
        [244709],
        null,
        null,
        `
When {npc:Portal Keeper Hasabel} casts {ability:244689:Transport Portal:shadow},
{npc:Blazing Imps} spawn, which all cast {ability:244709:Fiery Detonation:fire}.
If successfully cast, {ability:244709:Fiery Detonation:fire} deals huge damage to the raid,
and several successful casts is most likely a wipe.
As well as interrupts, make good use of other crowd control, such as stuns and grips, to ensure that
{ability:244709:Fiery Detonation:fire} is not cast.`
      ),
      new Interrupt(
        '3',
        2064,
        ['Howling Shadows'],
        [245504],
        null,
        null,
        `
When {npc:Portal Keeper Hasabel} casts {ability:244689:Transport Portal:shadow},
{npc:Hungering Stalkers} spawn, which cast {ability:245504:Howling Shadows:shadow}.
If {ability:245504:Howling Shadows:shadow} is not interrupted,
then all players within 60 yards will be interrupted for 6 seconds.`
      ),

      new Interrupt('4', 2064, ['Unstable Portal'], [255805]),

      new Interrupt(
        '5',
        2064,
        ['Flames of Xoroth'],
        [244607],
        null,
        null,
        `
Once through the red portal, players need to defeat {npc:Vulcanar}.
{npc:Vulcanar} will cast {ability:244607:Flames of Xoroth:fire},
which will deal damage to all nearby players unless interrupted.`
      ),
      new Hit(
        '6',
        2064,
        ['Supernova'],
        [244601],
        null,
        null,
        `
Once through the red portal, players will need to dodge {ability:244601:Supernova:fire}.
Impact locations are marked by swirls, and are easy to avoid.`
      ),

      new DebuffDuration(
        '7',
        2064,
        'Felsilk Wrap',
        'Felsilk Wrap (Removed)',
        0,
        `
Took an average of {averageDuration} to free allies from {ability}.`,
        null,
        `
Once through the green portals, players need to defeat {npc:Lady Dacidion}.
{npc:Lady Dacidion} will intermittently cast {ability:244949:Felsilk Wrap:nature} on a random player,
stunning them until the webbing around them is destroyed.
While players are trapped, they are taking damage, and should be freed as quickly as possible.`
      ),

      new DebuffDuration(
        '8',
        2064,
        'Delusions',
        'Delusions (Removed)',
        0,
        `
Waited for an average of {averageDuration} before dispelling {ability}.`,
        null,
        `
Once through the purple portal, healers will be afflicted with {ability:245050:Delusions:shadow},
which restores mana but prevents healing.
Healers should wait until they have enough mana to finish the fight, and then dispel themselves
so that they can heal again.`
      ),
      new DebuffDuration(
        '9',
        2064,
        'Mind Fog',
        'Mind Fog (Removed)',
        0,
        `
Clouded by {ability} for an average of {averageDuration}.`,
        null,
        `
Once through the purple portal, players are afflicted with {ability:245099:Mind Fog:shadow}.
While afflicted, players cannot see very far around themselves.
{ability:245099:Mind Fog:shadow} can be removed by standing near {ability:244613:Everburning Flames:fire},
which must be brought from inside the red portal by a player running into the fire,
and carrying it into the purple portal.
The player will likely lose the fire on the way, but can run back into it to pick it up again
(unless it was dispelled, in which case it does not fall to the floor and cannot be picked back up).
Players standing near the fire to remove {ability:245099:Mind Fog:shadow}
should be careful not to pick up the fire, as this will prevent other players from being able to stand near it.`
      )
    ];
  }
}
