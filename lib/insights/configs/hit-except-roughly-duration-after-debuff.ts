import { InsightConfig } from '../configs/insight-config';
import { DamageEvent } from '../../fight-events/models/damage-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';
import { DebuffEvent } from '../../fight-events/models/debuff-event';
import { Timestamp } from '../../helpers/timestamp-helper';

export class HitExceptRoughlyDurationAfterDebuff extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private damageEventConfigNames: string[],
    private damageAbilityIds: number[],
    private debuffEventConfigNames: string[],
    private debuffAbilityIds: number[],
    private debuffApplicationTimeRelativeToDamageTime: number,
    private gracePeriod: number = 200,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        'Hit by {damageAbilties} {totalHits} time{plural} (except roughly {debuffApplicationTimeRelativeToDamageTime} after gaining {debuffAbilities}).';
    if (detailsTemplate === null) this.detailsTemplate = '{playersAndHits}';
  }

  getProperties(context: InsightContext): any {
    const debuffEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.debuffEventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'debuff'
      )
      .map(x => <DebuffEvent>x);

    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.damageEventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'damage'
      )
      .map(x => <DamageEvent>x)
      .filter(
        damage =>
          !debuffEvents.some(
            debuff =>
              debuff.target.id === damage.target.id &&
              debuff.timestamp <
                damage.timestamp -
                  this.debuffApplicationTimeRelativeToDamageTime +
                  this.gracePeriod &&
              debuff.timestamp >
                damage.timestamp -
                  this.debuffApplicationTimeRelativeToDamageTime -
                  this.gracePeriod
          )
      );

    if (damageEvents.length === 0) {
      return null;
    }

    const timestamps = damageEvents.map(x => x.timestamp);
    const damageAbilties = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.damageAbilityIds
    );
    const debuffAbilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.debuffAbilityIds
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
    const totalHits = playersAndHits
      .map(x => x.frequency)
      .reduce((x, y) => x + y, 0);

    return {
      damageAbilties: MarkupHelper.AbilitiesWithIcons(damageAbilties),
      debuffAbilities: MarkupHelper.AbilitiesWithIcons(debuffAbilities),
      damageAbilityTooltips: MarkupHelper.AbilitiesWithTooltips(damageAbilties),
      debuffAbilityTooltips: MarkupHelper.AbilitiesWithTooltips(damageAbilties),
      totalHits: MarkupHelper.Info(totalHits),
      plural: this.getPlural(totalHits),
      playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits),
      timestamps: MarkupHelper.Timestamps(timestamps),
      debuffApplicationTimeRelativeToDamageTime: MarkupHelper.Info(
        Timestamp.ToSeconds(this.debuffApplicationTimeRelativeToDamageTime)
      )
    };
  }
}
