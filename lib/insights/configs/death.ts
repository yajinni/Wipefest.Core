import { InsightConfig } from '../configs/insight-config';
import { MarkupHelper } from '../../markup/markup-helper';
import { DeathEvent } from '../../fight-events/models/death-event';
import { PlayerAndTimestamp } from '../models/player-and-timestamp';
import { InsightContext } from '../models/insight-context';

export class Death extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private abilityIds: number[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null,
    major: boolean = false
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate, major);

    if (insightTemplate === null)
      this.insightTemplate =
        '{totalFrequency} player{plural} died to {abilities}.';
    if (detailsTemplate === null)
      this.detailsTemplate = '{playersAndTimestamps}';
  }

  getProperties(context: InsightContext): any {
    const deathEvents = context.events
      .filter(x => x.config)
      .filter(x => x.config.name === 'Deaths')
      .map(x => <DeathEvent>x)
      .filter(x => x.killingBlow)
      .filter(x => this.abilityIds.indexOf(x.killingBlow.guid) !== -1);

    if (deathEvents.length === 0) {
      return null;
    }

    const playersAndTimestamps = deathEvents.map(
      x => new PlayerAndTimestamp(x.source, x.timestamp)
    );
    const playersAndFrequencies = this.getPlayersAndFrequenciesFromSource(
      deathEvents
    );
    const totalFrequency = deathEvents.length;
    const abilities = deathEvents
      .map(x => x.killingBlow)
      .filter(
        (x, index, array) => array.map(y => y.guid).indexOf(x.guid) === index
      );

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalFrequency: MarkupHelper.Info(totalFrequency),
      plural: this.getPlural(totalFrequency),
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      ),
      playersAndTimestamps: MarkupHelper.PlayersAndTimestamps(
        playersAndTimestamps
      )
    };
  }
}
