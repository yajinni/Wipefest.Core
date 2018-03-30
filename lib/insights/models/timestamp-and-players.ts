import { Player } from '../../raid/raid';

export class TimestampAndPlayers {
  constructor(public timestamp: number, public players: Player[]) {}
}
