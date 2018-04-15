import { Observable } from 'rxjs/Observable';
import { CombatEvent } from '../combat-events/combat-event';
import { Report, FightInfo } from '../reports/report';
import { EventConfig } from 'event-configs/event-config';
import { HttpResult } from 'infrastructure/result';

export interface ICombatEventService {
  getCombatEvents(
    report: Report,
    fight: FightInfo,
    eventConfigs: EventConfig[]
  ): Observable<HttpResult<CombatEvent[]>>;
}
