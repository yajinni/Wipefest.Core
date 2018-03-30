import { Debuff } from '../../debuff';

export class Orbs extends Debuff {
  constructor(id: string) {
    super(
      id,
      2052,
      ['Orbs'],
      [248801, 239069],
      'Failed to soak {totalHits} orb{plural}.',
      '{abilitiesAndTimestamps}',
      `Failing to soak orbs causes the raid to gain {ability:248801:Fragment Burst:fire},
which deals heavy raid damage and increases further damage from {ability:248801:Fragment Burst:fire} for 8 seconds.
Gaining this several times will often cause a wipe, so it's important to make sure that all orbs are soaked.
Because orbs of both infusions spawn on both sides of the boss,
raids usually aim to have melee/healers soaking near the boss,
with ranged damage dealers soaking the remaining orbs in assigned lanes behind the melee/healers.`
    );
  }
}
