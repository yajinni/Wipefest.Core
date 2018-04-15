import { Report, FightInfo } from '../reports/report';
import { Fight } from './fight';
import { ICombatEventService } from '../combat-events/combat-event.service';
import { EventConfig } from '../event-configs/event-config';
import { Observable } from 'rxjs/Observable';
import { FightEventService } from '../fight-events/fight-event.service';
import { IDeathService } from '../deaths/death.service';
import { Death } from '../deaths/death';
import { SpecializationsService } from '../specializations/specializations.service';
import { RaidFactory } from '../raid/raid';
import { InsightService } from '../insights/insight.service';
import { InsightContext } from '../insights/models/insight-context';
import 'rxjs/add/operator/mergeMap';
import { CombatEvent } from '../combat-events/combat-event';
import { HttpResult, OkHttpResult, ErrorHttpResult } from 'infrastructure/result';

export class FightService {
  constructor(
    private readonly deathService: IDeathService,
    private readonly combatEventService: ICombatEventService,
    private readonly fightEventService: FightEventService,
    private readonly specializationsService: SpecializationsService,
    private readonly insightService: InsightService
  ) {}

  getFight(
    report: Report,
    fightInfo: FightInfo,
    eventConfigs: EventConfig[],
    deathThreshold: number = 0
  ): Observable<HttpResult<Fight>> {
    const deaths$ = this.deathService.getDeaths(report, fightInfo);
    const combatEvents$ = this.combatEventService.getCombatEvents(
      report,
      fightInfo,
      eventConfigs
    );

    return Observable.forkJoin([deaths$, combatEvents$]).map(results => {
      const deathsResult = results[0] as HttpResult<Death[]>;
      const combatEventsResult = results[1] as HttpResult<CombatEvent[]>;

      if (deathsResult.isFailure) {
        return new ErrorHttpResult<Fight>(deathsResult.status, deathsResult.error);
      }
      if (combatEventsResult.isFailure) {
        return new ErrorHttpResult<Fight>(combatEventsResult.status, combatEventsResult.error);
      }

      const deaths = deathsResult.value;
      const combatEvents = combatEventsResult.value;

      const events = this.fightEventService.getEvents(
        report,
        fightInfo,
        eventConfigs,
        combatEvents,
        deaths,
        deathThreshold
      );
      const raid = RaidFactory.Get(
        combatEvents.filter(x => x.type === 'combatantinfo'),
        report.friendlies,
        this.specializationsService
      );
      const insights = this.insightService.getInsights(
        fightInfo.boss,
        new InsightContext(report, fightInfo, raid, events)
      );

      return new OkHttpResult<Fight>(combatEventsResult.status, new Fight(report, fightInfo, raid, eventConfigs, events, insights));
    });
  }
}
