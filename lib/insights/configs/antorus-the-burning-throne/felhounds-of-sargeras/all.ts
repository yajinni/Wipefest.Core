import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { Hit } from '../../hit';
import { Debuff } from '../../debuff';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffUnlessRole } from '../../debuff-unless-role';
import { HitFriendly } from '../../hit-friendly';
import { SargerasBlessingDuration } from '../../antorus-the-burning-throne/felhounds-of-sargeras/sargeras-blessing-duration';

export namespace FelhoundsOfSargerasInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new DebuffUnlessRole(
        '0',
        2074,
        ['Smouldering', 'Decay'],
        [251445, 245098],
        'Tank',
        null,
        null,
        `
The ${MarkupHelper.Style(
          'boss',
          'Felhounds'
        )} will regularly cast {ability:251445:Smouldering:fire} / {ability:245098:Decay:shadow},
which deal damage and apply a debuff to all players stood in front of them.
Only tanks need to get hit by this, so players should be sure not to stand in front of either boss.`
      ),

      new HitWithoutDebuff(
        '1',
        2074,
        ['Desolate Path'],
        [244767],
        ['Desolate Gaze'],
        [244768],
        10000,
        'Failed to dodge {damageAbilties} {totalHits} time{plural}.',
        null,
        `
At 33 energy, ${MarkupHelper.Style(
          'boss',
          "F'Harg"
        )} will target several players with {ability:244768:Desolate Gaze:physical}.
6 seconds later, ${MarkupHelper.Style(
          'boss',
          "F'Harg"
        )} will cast {ability:244767:Desolate Path:fire},
causing a manifestation of flame to charge through the targeted players
and deal damage to anyone caught in its path.
Targeted players should move out of the raid, trying to make it easier for other players to dodge this mechanic.
This insight shows the hits to players that were not affected by the {ability:244768:Desolate Gaze:physical} debuff.`
      ),

      new Hit(
        '2',
        2074,
        ['Molten Flare'],
        [244163],
        null,
        null,
        `
At 66 energy, ${MarkupHelper.Style(
          'boss',
          "F'Harg"
        )} targets several players with {ability:244072:Molten Touch:fire},
stunning and damaging them.
The targeted player will send flame missiles towards other players,
which those players need to dodge to avoid unnecessary damage.
If the raid is grouped up when this happens, it is useful to move as a group.`
      ),

      new Hit(
        '3',
        2074,
        ['Consuming Sphere'],
        [254403],
        null,
        null,
        `
At 33 energy, ${MarkupHelper.Style(
          'boss',
          'Shatug'
        )} spawns a {ability:254403:Consuming Sphere:shadow},
which pulls the raid towards its location.
Players need to run away from the sphere to avoid hitting it,
which deals damage and applies a debuff that increases the damage taken from the sphere.`
      ),

      new Debuff(
        '4',
        2074,
        ['Weight of Darkness (Fear)'],
        [244071],
        'Feared by {abilities} {totalHits} time{plural}.',
        null,
        `
At 66 energy, ${MarkupHelper.Style(
          'boss',
          'Shatug'
        )} targets players with {ability:254429:Weight of Darkness:shadow},
which progressively slows the target for 5 seconds.
When the debuff expires, targets within 8 yards are feared, unless there are at least 2 other players within 8 yards.
Counter this mechanic by ensuring every target has enough players stacked on them to prevent the fear.`
      ),

      new SargerasBlessingDuration('5'),

      new Hit(
        '6',
        2074,
        ['Burning Flash'],
        [244681],
        null,
        null,
        `
Half of the raid will be afflicted with {ability:244054:Flametouched:fire}.
When these players take shadow damage (such as from {ability:244583:Siphoned:shadow} or {ability:244130:Consuming Detonation:shadow}),
they spawn yellow circles that will explode, dealing {ability:244681:Burning Flash:fire} damage.
{ability:244054:Flametouched:fire} players should move as a group to avoid this mechanic.`
      ),

      new Hit(
        '7',
        2074,
        ['Burning Remnant'],
        [245022],
        null,
        null,
        `
Whenever {ability:244681:Burning Flash:fire} explodes, it leaves fire patches on the ground for 2 minutes.
These fire patches deal {ability:245022:Burning Remnant:fire} damage.
This damage is small, and players may choose to stand in these fire patches to stack more patches on top of them and save space.`
      ),

      new HitFriendly(
        '8',
        2074,
        ['Shadowscar'],
        [245100],
        null,
        null,
        `
Half of the raid will be afflicted with {ability:244055:Shadowtouched:shadow}.
When these players take fire damage (such as from {ability:244163:Molten Flare:fire} or {ability:244473:Enflamed:fire}),
They trigger {ability:245100:Shadowscar:shadow}, gripping the nearest ally to them and blasting them for shadow damage.`
      )
    ];
  }
}
