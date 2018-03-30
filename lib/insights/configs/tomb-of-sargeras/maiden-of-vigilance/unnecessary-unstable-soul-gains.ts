import { InsightConfig } from '../../insight-config';
import { DebuffEvent } from 'fight-events/models/debuff-event';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { AbilityEvent } from 'fight-events/models/ability-event';
import { InsightContext } from '../../../models/insight-context';

export class UnnecessaryUnstableSoulGains extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2052,
      'Unnecessarily gained {unstableSoul} {totalFrequency} time{plural}.',
      '{playersAndFrequencies}',
      `Players can gain {unstableSoulTooltip} in three different ways:
${MarkupHelper.Info(
        '(1)'
      )} Whenever the boss casts {ability:235267:Mass Instability:holy}, three people gain {unstableSoulTooltip};
${MarkupHelper.Info(
        '(2)'
      )} Whenever two players of opposite infusions collide, they gain {unstableSoulTooltip};
${MarkupHelper.Info(
        '(3)'
      )} Whenever a player is hit by an ability that does not match their infusion, they gain {unstableSoulTooltip}.
Source ${MarkupHelper.Info('(1)')} cannot be avoided, but ${MarkupHelper.Info(
        '(2)'
      )} and ${MarkupHelper.Info('(3)')} can and should be avoided.
To avoid ${MarkupHelper.Info(
        '(2)'
      )}, the raid can group all players with {ability:235213:Light Infusion:holy} on one side of the boss,
and players with {ability:235240:Fel Infusion:fire} on the other side.
To avoid ${MarkupHelper.Info(
        '(3)'
      )}, players must focus on dodging orbs that don't match their infusion,
as well as abilities such as {ability:238037:Light Echoes:holy} / {ability:238420:Fel Echoes:fire}.`
    );
  }

  getProperties(context: InsightContext): any {
    const castEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name === 'Mass Instability' &&
          x.config.eventType === 'ability'
      )
      .map(x => <AbilityEvent>x);

    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name === 'Unstable Soul' && x.config.eventType === 'debuff'
      )
      .map(x => <DebuffEvent>x)
      .filter(debuff =>
        castEvents.every(
          cast =>
            debuff.timestamp - cast.timestamp < 1750 ||
            debuff.timestamp - cast.timestamp > 2250
        )
      );

    if (debuffEvents.length === 0) {
      return null;
    }

    const playersAndFrequencies = this.getPlayersAndFrequenciesFromTarget(
      debuffEvents
    );
    const totalFrequency = playersAndFrequencies
      .map(x => x.frequency)
      .reduce((x, y) => x + y);
    const unstableSoul = debuffEvents[0].ability;

    return {
      unstableSoul: MarkupHelper.AbilityWithIcon(unstableSoul),
      unstableSoulTooltip: MarkupHelper.AbilityWithTooltip(unstableSoul),
      totalFrequency: MarkupHelper.Info(totalFrequency),
      plural: this.getPlural(totalFrequency),
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      )
    };
  }
}
