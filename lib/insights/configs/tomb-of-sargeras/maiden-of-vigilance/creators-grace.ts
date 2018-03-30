import { StackThreshold } from '../../stack-threshold';

export class CreatorsGrace extends StackThreshold {
  constructor(id: string) {
    super(
      id,
      2052,
      ["Creator's Grace (7)", "Demon's Vigor (7)"],
      [235534, 235538],
      7,
      null,
      null,
      `When a player soaks an orb that matches their infusion,
they gain a stack of {abilityTooltips}, which increases throughput.
Nearby players also gain a stack. The range of this is fairly small, so make sure to group tightly when collecting orbs.
Gaining stacks allows you to break {ability:235028:Titanic Bulwark:holy} sooner,
ending the phase and putting a stop to the increasing raid damage.`
    );
  }
}
