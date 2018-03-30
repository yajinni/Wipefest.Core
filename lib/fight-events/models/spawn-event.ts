import { FightEvent } from './fight-event';
import { EventConfig } from 'event-configs/event-config';
import { Actor } from 'reports/report';
import { MarkupHelper } from '../../markup/markup-helper';

export class SpawnEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public isFriendly: boolean,
    public x: number,
    public y: number,
    private actor: Actor,
    private instance: number
  ) {
    super(config, timestamp, isFriendly, x, y);
  }

  get title(): string {
    if (this.config.title) return this.config.title;

    return `${MarkupHelper.Actor(this.actor)}${this.frequencyString(
      this.instance
    )} spawned`;
  }
  get mediumTitle(): string {
    if (this.config.title) return this.config.title;

    return this.title;
  }
  get shortTitle(): string {
    return this.initials(this.actor.name) + this.frequencyString(this.instance);
  }
}
