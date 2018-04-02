import { Timestamp } from '../../helpers/timestamp-helper';
import { EventConfig } from 'event-configs/event-config';
import { FightEventDto } from './fight-event-dto';

export abstract class FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public isFriendly: boolean,
    public x: number,
    public y: number,
    public childEvents: FightEvent[] = []
  ) {}

  isFocused = true;
  collapsed = true;
  get canCollapse(): boolean {
    return this.childEvents.length > 0 || this.details !== null;
  }

  rowClass = '';
  get rowClasses(): string {
    return (
      this.rowClass +
      (this.config && this.config.style ? ` ${this.config.style}` : '')
    );
  }

  abstract get title(): string;
  get mediumTitle(): string {
    return this.title;
  }
  get shortTitle(): string {
    return this.title;
  }

  get tableTitle(): string {
    const isFriendly = this.isFriendly;
    this.isFriendly = true;
    const friendlyTitle = this.title;
    this.isFriendly = isFriendly;

    return friendlyTitle;
  }

  get minutesAndSeconds(): string {
    return Timestamp.ToMinutesAndSeconds(this.timestamp);
  }

  get details(): string {
    return null;
  }

  protected initials(input: string): string {
    return input
      .split(' ')
      .map(w => w[0])
      .join('');
  }

  protected frequencyString(input: number): string {
    if (input <= 1) {
      return '';
    }
    return ` (${input})`;
  }

  isInstanceOf(classType: any): boolean {
    return this instanceof classType;
  }

  toJSON(): any {
    return this.toDto();
  }

  toDto(): FightEventDto {
    let childEventDtos = [];
    if (this.childEvents) {
      childEventDtos = this.childEvents.map(x => x.toDto());
    }

    return new FightEventDto(
      this.config,
      this.timestamp,
      this.minutesAndSeconds,
      this.x,
      this.y,
      this['sequence'],
      this.isFriendly,
      this.title,
      this.tableTitle,
      this['ability'],
      this['stack'],
      this['killingBlow'],
      this['damage'],
      this['absorbed'],
      this['overkill'],
      this['deathWindow'],
      this['damageTaken'],
      this['healingReceived'],
      this['source'],
      this['target'],
      this['from'],
      this['actor'],
      this['instance'],
      this.childEvents.map(event => event.toDto()),
      this['isChild'],
      this.details,
      this['phase'],
      this['text'],
      this['subtitle'],
      this['kill']
    );
  }
}
