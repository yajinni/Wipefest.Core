export class CombatEvent {
  ability: CombatAbility;
  extraAbility: CombatAbility;
  absorbed: number;
  amount: number;
  timestamp: number;
  attackPower: number;
  classResources: ClassResource[];
  gear: PlayerGear[];
  hitPoints: number;
  itemLevel: number;
  maxHitPoints: number;
  overkill: number;
  pin: string;
  resolve: number;
  resourceActor: number;
  sourceID: number;
  sourceIsFriendly: boolean;
  sourceInstance: number;
  specID: number;
  spellPower: number;
  stack: number;
  targetID: number;
  target: Target;
  targetInstance: number;
  targetIsFriendly: boolean;
  type: string;
  x: number;
  y: number;
}

export class CombatAbility {
  name: string;
  type: number;
  guid: number;
  abilityIcon: string;
}

export class ClassResource {
  amount: number;
  cost: number;
  max: number;
  type: number;
}

export class PlayerGear {
  bonusIDs: number[];
  icon: string;
  id: number;
  itemLevel: number;
  quality: number;
}

export class Target {
  guid: number;
  icon: string;
  id: number;
  name: string;
  type: string;
}
