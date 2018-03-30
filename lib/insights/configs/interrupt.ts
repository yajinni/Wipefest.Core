import { InsightConfig } from '../configs/insight-config';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';
import { InterruptEvent } from '../../fight-events/models/interrupt-event';
import { AbilityEvent } from '../../fight-events/models/ability-event';
import { PlayerAndTimestamp } from '../models/player-and-timestamp';

export class Interrupt extends InsightConfig {
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
        'Interrupted {abilities} {totalInterrupts}/{totalCastAttempts} time{plural}.';
    if (detailsTemplate === null)
      this.detailsTemplate =
        '{playersSection}{interruptsSection}{castsSection}';
  }

  getProperties(context: InsightContext): any {
    const interruptEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'interrupt'
      )
      .map(x => <InterruptEvent>x)
      .filter(x => x.isFriendly);

    const abilityEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'ability'
      )
      .map(x => <AbilityEvent>x);

    const totalCastAttempts = interruptEvents.length + abilityEvents.length;

    if (totalCastAttempts === 0) {
      return null;
    }

    let abilities = this.getAbilitiesIfTheyExist(
      interruptEvents,
      this.abilityIds
    );
    if (abilities.length === 0) {
      abilities = this.getAbilitiesIfTheyExist(abilityEvents, this.abilityIds);
    }

    const playersAndTimestamps = interruptEvents.map(
      x => new PlayerAndTimestamp(x.source, x.timestamp)
    );
    const players = interruptEvents
      .map(x => x.source)
      .filter(
        (x, index, array) => array.map(y => y.id).indexOf(x.id) === index
      );
    const playersAndFrequencies = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: interruptEvents.filter(x => x.source.id === player.id)
              .length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);
    const totalInterrupts = playersAndFrequencies
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);
    const castTimestamps = abilityEvents.map(x => x.timestamp);

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      totalInterrupts: MarkupHelper.Info(totalInterrupts),
      plural: this.getPlural(totalInterrupts),
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      ),
      playersAndTimestamps: MarkupHelper.PlayersAndTimestamps(
        playersAndTimestamps
      ),
      totalCastAttempts: MarkupHelper.Info(totalCastAttempts),
      castTimestamps: MarkupHelper.Timestamps(castTimestamps),
      playersSection: playersAndFrequencies.length
        ? '<h6>Players</h6><p>{playersAndFrequencies}</p>'
        : '',
      interruptsSection: playersAndTimestamps.length
        ? '<h6>Interrupts</h6><p>{playersAndTimestamps}</p>'
        : '',
      castsSection: castTimestamps.length
        ? '<h6>Casts</h6>{castTimestamps}'
        : ''
    };
  }
}
