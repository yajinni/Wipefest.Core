import { InsightConfig } from '../configs/insight-config';
import { DebuffEvent } from '../../fight-events/models/debuff-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';

export class DebuffUnlessRole extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    private role: string,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null,
    major: boolean = false
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate, major);

    if (insightTemplate === null)
      this.insightTemplate =
        'Non-{role}s gained {abilities} {totalHits} time{plural}.';
    if (detailsTemplate === null) this.detailsTemplate = '{playersAndHits}';
  }

  getProperties(context: InsightContext): any {
    const playersOfRole = context.raid.players.filter(
      p => p.specialization && p.specialization.role === this.role
    );

    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'debuff'
      )
      .map(x => <DebuffEvent>x)
      .filter(x => !playersOfRole.some(t => t.name === x.target.name));

    if (debuffEvents.length === 0) {
      return null;
    }

    const timestamps = debuffEvents.map(x => x.timestamp);
    const abilities = this.getAbilitiesIfTheyExist(
      debuffEvents,
      this.abilityIds
    );
    const players = debuffEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndHits = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: debuffEvents.filter(x => x.target.id === player.id)
              .length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);
    const totalHits = playersAndHits
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalHits: MarkupHelper.Info(totalHits),
      plural: this.getPlural(totalHits),
      playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits),
      timestamps: MarkupHelper.Timestamps(timestamps),
      role: this.role
    };
  }
}
