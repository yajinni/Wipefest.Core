import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffDuration } from '../../debuff-duration';
import { HitUnlessRole } from '../../hit-unless-role';
import { MarkedPrey } from '../../antorus-the-burning-throne/varimathras/marked-prey';

export namespace VarimathrasInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      // Necrotic Embrace spreads

      new HitUnlessRole('0', 2069, ['Shadow Strike'], [243960], 'Tank', null, null, null, true),
      new DebuffDuration(
        '4',
        2069,
        'Echoes of Doom',
        'Echoes of Doom (Removed)',
        3470,
        `
Killed {npc:Shadow of Varimathras} adds in an average of {averageDuration} after spawning, with {totalFrequencyOverThreshold} completing {possesivePronoun} {ability} cast.`,
        `
{playersWithDurationsOverThresholdAndTimestamps}`,
        `
On mythic difficulty, getting hit by {ability:243963:Alone in the Darkness:shadow}
will spawn a {npc:Shadow of Varimathras}.
This add will channel {ability:248732:Echoes of Doom:shadow},
debuffing a player with {ability:248732:Echoes of Doom:shadow},
which, when the channel completes, leaves a pool at the player's feet that deals shadow damage.
Because these pools deal shadow damage, they will trigger {ability:243961:Misery:shadow} if stepped in,
so need to be placed safely away from the raid.
Aim to kill all {npc:Shadow of Varimathras} adds before they can successfully finish casting {ability:248732:Echoes of Doom:shadow}.`
      ),
      new MarkedPrey('1'),
      new Hit('2', 2069, ['Dark Fissure'], [244005]),
      new HitWithoutDebuff(
        '3',
        2069,
        ['Alone in the Darkness'],
        [243963],
        ['Necrotic Embrace'],
        [244094],
        10000,
        null,
        null,
        null,
        true
      )
    ];
  }
}
