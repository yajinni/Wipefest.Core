export class Report {
  id: string;
  friendlies: Actor[];
  friendlyPets: PetActor[];
  enemies: Actor[];
  fights: FightInfo[];
  title: string;
  owner: string;
  start: number;
  end: number;
}

export class Actor {
  fights: FightId[];
  id: number;
  guid: number;

  constructor(
    public name: string,
    public type: string = 'NPC',
    public instance: number = 0
  ) {}
}

export class PetActor extends Actor {
  petOwner: number;
}

export class FightId {
  id: number;
}

export class FightInfo {
  boss: number;
  bossPercentage: number;
  difficulty: number;
  end_time: number;
  fightPercentage: number;
  id: number;
  kill: boolean;
  lastPhaseForPercentageDisplay: number;
  name: string;
  partial: number;
  size: number;
  start_time: number;
}
