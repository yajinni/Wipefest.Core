import { EventConfig } from 'event-configs/event-config';
import { Ability } from './ability-event';
import { Actor } from 'reports/report';

export class FightEventDto {
  constructor(
    public config: EventConfig,
    public timestamp: number,
    public x: number,
    public y: number,
    public sequence: number,
    public isFriendly: boolean,
    public title: string,
    public tableTitle: string,
    public ability: Ability,
    public stack: number,
    public killingBlow: Ability,
    public damage: number,
    public absorbed: number,
    public overkill: number,
    public deathWindow: number,
    public damageTaken: number,
    public healingReceived: number,
    public source: Actor,
    public target: Actor,
    public from: Actor,
    public actor: Actor,
    public instance: number,
    public childEvents: FightEventDto[],
    public isChild: boolean,
    public details: string,
    public phase: string,
    public text: string,
    public subtitle: boolean,
    public kill: boolean
  ) {
    Object.keys(this).forEach(
      key =>
        (this[key] === undefined ||
          this[key] === null ||
          this[key].length === 0) &&
        delete this[key]
    );
  }
}
