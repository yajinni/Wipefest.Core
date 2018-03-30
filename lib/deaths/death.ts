import { CombatEvent } from 'combat-events/combat-event';

export class Death {
  deathWindow: number;
  damage: DeathDamage;
  healing: DeathHealing;
  id: number;
  name: string;
  timestamp: number;
  events: CombatEvent[];
}

export class DeathDamage {
  total: number;
}

export class DeathHealing {
  total: number;
}
