import { PhaseDuration } from '../../phase-duration';

export class TitanicBulwark extends PhaseDuration {
  constructor(id: string) {
    super(
      id,
      2052,
      'Phase 2',
      null,
      null,
      `During {phase}, the raid takes ever-increasing damage from {ability:234891:Wrath of the Creators:holy}.
{phase} ends when the raid has done enough damage to break {ability:235028:Titanic Bulwark:holy}.
It can be useful to save damage cooldowns and {ability:32182:Heroism:nature} for this phase to break the shield quicker.`
    );
  }
}
