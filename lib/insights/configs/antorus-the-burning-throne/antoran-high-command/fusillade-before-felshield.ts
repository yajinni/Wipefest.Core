import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { InsightContext } from '../../../models/insight-context';
import { DebuffEvent } from 'fight-events/models/debuff-event';
import { AbilityEvent } from 'fight-events/models/ability-event';

export class FusilladeBeforeFelshield extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2070,
      `Failed to activate {felshield} before {fusillade} {total} time{plural}.`,
      `{timestamps}`,
      `
When {ability:244625:Fusillade:fire} is being cast,
the raid can mitigate half of the incoming damage by clicking on a ${MarkupHelper.Style(
        'npc',
        'Felshield Emitter'
      )}
spawned by a pod player.
This creates a {ability:244910:Felshield:fire} that the raid should stand in to survive the damage.`
    );
  }

  getProperties(context: InsightContext): any {
    const felshieldEvents = context.events
      .filter(x => x.config)
      .filter(
        x => x.config.name === 'Felshield' && x.config.eventType === 'debuff'
      )
      .map(x => <DebuffEvent>x);

    const fusilladeEvents = context.events
      .filter(x => x.config)
      .filter(
        x => x.config.name === 'Fusillade' && x.config.eventType === 'ability'
      )
      .map(x => <AbilityEvent>x);

    if (fusilladeEvents.length === 0) {
      return null;
    }

    const fusilladesWithoutFelshields = fusilladeEvents.filter(
      fusillade =>
        !felshieldEvents.some(
          felshield =>
            felshield.timestamp > fusillade.timestamp - 8000 &&
            felshield.timestamp < fusillade.timestamp + 2000
        )
    );

    if (fusilladesWithoutFelshields.length === 0) {
      return null;
    }

    const timestamps = fusilladesWithoutFelshields.map(x => x.timestamp);
    const total = fusilladesWithoutFelshields.length;
    const fusillade = fusilladeEvents[0].ability;

    return {
      timestamps: MarkupHelper.Timestamps(timestamps),
      total: MarkupHelper.Info(total),
      plural: this.getPlural(total),
      fusillade: MarkupHelper.AbilityWithIcon(fusillade),
      felshield:
        felshieldEvents.length > 0
          ? MarkupHelper.AbilityWithIcon(felshieldEvents[0].ability)
          : MarkupHelper.AbilityWithTooltip2(244910, 'Felshield', 'fire')
    };
  }
}
