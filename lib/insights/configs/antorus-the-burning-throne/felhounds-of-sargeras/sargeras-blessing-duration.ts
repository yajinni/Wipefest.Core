import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { DebuffEvent } from 'fight-events/models/debuff-event';
import { RemoveDebuffEvent } from 'fight-events/models/remove-debuff-event';
import { PlayerAndDuration } from '../../../models/player-and-duration';
import { Timestamp } from '../../../../helpers/timestamp-helper';
import { InsightContext } from '../../../models/insight-context';

export class SargerasBlessingDuration extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2074,
      'Had a total {ability} duration of {totalDuration}.',
      '{playersAndDurationsOverThreshold}',
      `
Whenever ${MarkupHelper.Style('boss', "F'Harg")} and ${MarkupHelper.Style(
        'boss',
        'Shatug'
      )} are within 40 yards of one another,
they gain {ability:246057:Sargeras' Blessing:shadow},
which massively increases their damage done.
Prevent them from gaining this debuff by tanking them at least 40 yards apart.
Ranged players can stay between the two bosses, so that everything is within their range.`
    );
  }

  getProperties(context: InsightContext): any {
    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name === "Sargeras' Blessing" &&
          x.config.eventType === 'debuff'
      )
      .map(x => <DebuffEvent>x)
      .sort((x, y) => x.timestamp - y.timestamp);

    const removeDebuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.name === "Sargeras' Blessing (Removed)" &&
          x.config.eventType === 'removedebuff'
      )
      .map(x => <RemoveDebuffEvent>x)
      .sort((x, y) => x.timestamp - y.timestamp);

    const playersAndDurations = debuffEvents
      .map(gained => {
        const removeDebuffEvent = removeDebuffEvents.find(
          lost =>
            gained.ability.guid === lost.ability.guid &&
            lost.timestamp > gained.timestamp
        );
        if (!removeDebuffEvent) {
          return new PlayerAndDuration(
            gained.target,
            context.fightInfo.end_time -
              context.fightInfo.start_time -
              gained.timestamp
          );
        }

        const duration = removeDebuffEvent.timestamp - gained.timestamp;

        return new PlayerAndDuration(removeDebuffEvent.target, duration);
      })
      .filter(x => x !== null);

    if (playersAndDurations.length === 0) {
      return null;
    }

    const totalDuration = playersAndDurations
      .map(x => x.duration)
      .reduce((x, y) => x + y);
    const averageDuration = totalDuration / playersAndDurations.length;
    const playersAndDurationsOverThreshold = playersAndDurations.filter(
      x => x.duration >= 0
    );
    const totalFrequencyOverThreshold = playersAndDurationsOverThreshold.length;
    const ability = debuffEvents[0].ability;

    return {
      ability: MarkupHelper.AbilityWithIcon(ability),
      abilityTooltip: MarkupHelper.AbilityWithTooltip(ability),
      averageDuration: MarkupHelper.Info(Timestamp.ToSeconds(averageDuration)),
      totalDuration: MarkupHelper.Info(Timestamp.ToSeconds(totalDuration)),
      totalFrequencyOverThreshold: MarkupHelper.Info(
        totalFrequencyOverThreshold
      ),
      plural: this.getPlural(totalFrequencyOverThreshold),
      playersAndDurationsOverThreshold: MarkupHelper.PlayersAndDurations(
        playersAndDurationsOverThreshold
      )
    };
  }
}
