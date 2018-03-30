import { InsightConfig } from '../configs/insight-config';
import { DamageEvent } from '../../fight-events/models/damage-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';

export class HitHard extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    private threshold: number,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        '{totalHits} hit{plural} of {abilities} did more than {threshold} non-absorbed damage.';
    if (detailsTemplate === null) this.detailsTemplate = '{playersAndDamages}';
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          x.config.eventType === 'damage' &&
          this.eventConfigNames.indexOf(x.config.name) !== -1
      )
      .map(x => <DamageEvent>x)
      .filter(x => x.damage + (x.overkill ? x.overkill : 0) > this.threshold);

    if (damageEvents.length === 0) {
      return null;
    }

    const timestamps = damageEvents.map(x => x.timestamp);
    const abilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.abilityIds
    );
    const players = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndHits = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: damageEvents.filter(x => x.target.id === player.id)
              .length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);
    const playersAndDamages = damageEvents.map(
      event =>
        <any>{
          player: event.target,
          damage: event.damage,
          absorbed: event.absorbed,
          overkill: event.overkill
        }
    );
    const totalHits = playersAndHits
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalHits: MarkupHelper.Info(totalHits),
      plural: this.getPlural(totalHits),
      playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits),
      playersAndDamages: MarkupHelper.PlayersAndDamages(playersAndDamages),
      timestamps: MarkupHelper.Timestamps(timestamps),
      threshold: MarkupHelper.Danger(this.threshold)
    };
  }
}
