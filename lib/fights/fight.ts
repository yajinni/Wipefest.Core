import { EventConfig } from '../event-configs/event-config';
import { FightEvent } from '../fight-events/models/fight-event';
import { Report, FightInfo } from '../reports/report';
import { Raid } from '../raid/raid';
import { Insight } from '../insights/models/insight';

export class Fight {
  constructor(
    public report: Report,
    public info: FightInfo,
    public raid: Raid,
    public eventConfigs: EventConfig[],
    public events: FightEvent[],
    public insights: Insight[]
  ) {}
}
