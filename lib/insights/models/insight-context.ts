import { Report, FightInfo } from '../../reports/report';
import { Raid } from '../../raid/raid';
import { FightEvent } from '../../fight-events/models/fight-event';

export class InsightContext {
  constructor(
    public report: Report,
    public fightInfo: FightInfo,
    public raid: Raid,
    public events: FightEvent[]
  ) {}
}
