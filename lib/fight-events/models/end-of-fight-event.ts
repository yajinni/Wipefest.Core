import { TitleEvent } from './title-event';
import { EventConfig } from '../../event-configs/event-config';

export class EndOfFightEvent extends TitleEvent {
  constructor(public timestamp: number, public kill: boolean) {
    super(timestamp, kill ? 'Kill' : 'Wipe');

    this.config = new EventConfig({ eventType: 'endOfFight' });
  }
}
