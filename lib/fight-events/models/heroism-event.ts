import { FightEvent } from './fight-event';
import { Ability } from './ability-event';
import { EventConfig } from 'event-configs/event-config';
import { MarkupHelper } from '../../markup/markup-helper';

export class HeroismEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public ability: Ability
  ) {
    super(config, timestamp, true, null, null);
  }

  rowClass = 'heroism';

  get title(): string {
    return MarkupHelper.Ability(this.ability);
  }
}
