import { Ability } from '../../fight-events/models/ability-event';

export class AbilityAndTimestamp {
  constructor(public ability: Ability, public timestamp: number) {}
}
