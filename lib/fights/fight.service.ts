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
  ): Observable<Fight> {
    const deaths$ = this.deathService.getDeaths(report, fightInfo);
    const combatEvents$ = this.combatEventService.getCombatEvents(
      report,
      fightInfo,
      eventConfigs
    );

    return Observable.forkJoin([deaths$, combatEvents$]).map(results => {
      const deaths = results[0] as Death[];
      const combatEvents = results[1] as CombatEvent[];

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

      return new Fight(report, fightInfo, raid, eventConfigs, events, insights);
    });
  }
}
