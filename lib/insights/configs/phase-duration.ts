import { InsightConfig } from '../configs/insight-config';
import { MarkupHelper } from '../../markup/markup-helper';
import { PhaseChangeEvent } from '../../fight-events/models/phase-change-event';
import { PhaseAndDuration } from '../models/phase-and-duration';
import { Timestamp } from '../../helpers/timestamp-helper';
import { InsightContext } from '../models/insight-context';

export class PhaseDuration extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private phase: string,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        'Had an average {phase} duration of {averageDuration}.';
    if (detailsTemplate === null) this.detailsTemplate = '{phasesAndDurations}';
  }

  getProperties(context: InsightContext): any {
    const phaseEvents = context.events
      .filter(x => x.config)
      .filter(x => x.config.eventType === 'phase')
      .map(x => <PhaseChangeEvent>x)
      .sort((x, y) => x.timestamp - y.timestamp);

    const phasesAndDurations = phaseEvents
      .map(phase => {
        const nextPhase = phaseEvents.find(x => x.timestamp > phase.timestamp);
        if (!nextPhase) {
          return null;
        }
        return new PhaseAndDuration(
          phase.config.name,
          nextPhase.timestamp - phase.timestamp
        );
      })
      .filter(x => x !== null)
      .filter(x => x.phase === this.phase);

    if (phasesAndDurations.length === 0) {
      return null;
    }

    const averageDuration =
      phasesAndDurations.map(x => x.duration).reduce((x, y) => x + y) /
      phasesAndDurations.length;

    return {
      phase: MarkupHelper.Info(this.phase),
      averageDuration: MarkupHelper.Info(
        Timestamp.ToMinutesAndSeconds(averageDuration)
      ),
      phasesAndDurations: MarkupHelper.PhasesAndDurations(phasesAndDurations)
    };
  }
}
