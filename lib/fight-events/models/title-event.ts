import { FightEvent } from './fight-event';

export class TitleEvent extends FightEvent {
  constructor(
    public timestamp: number,
    public text: string,
    public sequence = 0,
    public subtitle = false
  ) {
    super(null, timestamp, null, null, null);
  }

  get title(): string {
    return `${this.text}${this.sequence ? ` ${this.sequence}` : ''} (${
      this.minutesAndSeconds
    })`;
  }
}
