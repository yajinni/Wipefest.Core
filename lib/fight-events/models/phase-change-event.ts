import { FightEvent } from './fight-event';
import { EventConfig } from 'event-configs/event-config';

export class PhaseChangeEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public phase: string,
    public show: boolean = true
  ) {
    super(config, timestamp, null, null, null);
  }

  get title(): string {
    return this.phase + ' (' + this.minutesAndSeconds + ')';
  }
}
