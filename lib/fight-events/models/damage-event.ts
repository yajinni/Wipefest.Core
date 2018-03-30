import { FightEvent } from './fight-event';
import { EventConfig } from 'event-configs/event-config';
import { Ability } from './ability-event';
import { Actor } from 'reports/report';
import { MarkupHelper } from '../../markup/markup-helper';

export class DamageEvent extends FightEvent {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public isFriendly: boolean,
    public x: number,
    public y: number,
    public source: Actor,
    private showSource: boolean = true,
    public target: Actor,
    public ability: Ability,
    public damage: number,
    public absorbed: number,
    public overkill: number,
    private isChild: boolean
  ) {
    super(config, timestamp, isFriendly, x, y);
  }

  get damageText(): string {
    return MarkupHelper.Damage(this.damage, this.absorbed, this.overkill);
  }

  get tableTitle(): string {
    return this.title;
  }

  get title(): string {
    if (this.config.title) return this.config.title;

    let title = `${MarkupHelper.Ability(this.ability)} (${this.damageText})${
      this.source && this.isFriendly && this.showSource
        ? ` from ${MarkupHelper.Actor(this.source)}`
        : ''
    }`;
    if (!this.isChild) {
      title = `${MarkupHelper.Actor(this.target)} damaged by ` + title;
    }

    return title;
  }
  get mediumTitle(): string {
    if (this.config.title) return this.config.title;

    let title = `${MarkupHelper.Ability(this.ability)}${
      this.source && this.isFriendly && this.showSource
        ? ` from ${MarkupHelper.Actor(this.source)}`
        : ''
    }`;
    if (!this.isChild) {
      title = `${MarkupHelper.Actor(this.target)} damaged by ` + title;
    }

    return title;
  }
  get shortTitle(): string {
    return `${this.initials(this.ability.name)} ({[style="danger"] ${
      this.damage
    }})`;
  }
}
