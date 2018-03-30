import { DebuffDuration } from '../../debuff-duration';

export class MoonBurn extends DebuffDuration {
  constructor(id: string) {
    super(
      id,
      2050,
      'Moon Burn',
      'Moon Burn (Removed)',
      10000,
      null,
      null,
      `{abilityTooltip} is a 30 second long debuff that deals damage every 2 seconds.
Players can remove it by crossing the line (triggering {ability:234998:Astral Purge:spellshadow}).
On Mythic, make sure to watch the raid's current {ability:236330:Astral Vulnerability:physical} stacks before crossing the line.
Crossing at low or zero stacks will reduce unnecessary raid damage.
When teams split into groups of 5 or less to deal with {ability:236330:Astral Vulnerability:physical},
they typically decide to drop {abilityTooltip} debuffs inbetween these groups.`
    );
  }
}
