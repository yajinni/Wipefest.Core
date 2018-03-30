import { Actor } from '../../reports/report';
import { Ability } from '../../fight-events/models/ability-event';

export class PlayerAndAbility {
  constructor(public player: Actor, public ability: Ability) {}
}
