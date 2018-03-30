import { InsightConfig } from '../configs/insight-config';
import { AbilityEvent } from '../../fight-events/models/ability-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';

export class Cast extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        '{abilities} was cast {totalFrequency} time{plural}.';
    if (detailsTemplate === null) this.detailsTemplate = '{timestamps}';
  }

  getProperties(context: InsightContext): any {
    const abilityEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'ability'
      )
      .map(x => <AbilityEvent>x);

    if (abilityEvents.length === 0) {
      return null;
    }

    const timestamps = abilityEvents.map(x => x.timestamp);
    const abilities = this.getAbilitiesIfTheyExist(
      abilityEvents,
      this.abilityIds
    );
    const totalFrequency = abilityEvents.length;

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalFrequency: MarkupHelper.Info(totalFrequency),
      plural: this.getPlural(totalFrequency),
      timestamps: MarkupHelper.Timestamps(timestamps)
    };
  }
}
