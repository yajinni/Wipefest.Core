import { Observable } from 'rxjs/Observable';
import { Report, FightInfo } from '../reports/report';
import { ICombatEventService } from '../combat-events/combat-event.service';
import { CombatEvent } from '../combat-events/combat-event';
import { EventConfig } from '../event-configs/event-config';
import { EventConfigService } from '../event-configs/event-config.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/last';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/of';
import { AxiosInstance, AxiosResponse } from 'axios';
import { HttpService } from 'infrastructure/http.service';
import {
  HttpResult,
  ErrorHttpResult,
  OkHttpResult
} from 'infrastructure/result';

export class WarcraftLogsCombatEventService extends HttpService
  implements ICombatEventService {
  constructor(
    private eventConfigService: EventConfigService,
    http: AxiosInstance,
    private apiKey: string
  ) {
    super(http);
  }

  getCombatEvents(
    report: Report,
    fight: FightInfo,
    eventConfigs: EventConfig[]
  ): Observable<HttpResult<CombatEvent[]>> {
    const query = this.getQuery(eventConfigs);

    return this.getPageOfCombatEvents(
      report,
      fight.start_time,
      fight.end_time,
      query
    )
      .expand(result => {
        if (result.isFailure) {
          return Observable.empty();
        }

        const page = result.value;
        if (!page.nextPageTimestamp) {
          return Observable.empty();
        }

        return this.getPageOfCombatEvents(
          report,
          page.nextPageTimestamp,
          fight.end_time,
          query,
          page
        );
      })
      .last()
      .map(result => {
        if (result.isFailure) {
          return new ErrorHttpResult<CombatEvent[]>(
            result.status,
            result.error
          );
        }
        return new OkHttpResult<CombatEvent[]>(
          result.status,
          result.value.events
        );
      });
  }

  private getPageOfCombatEvents(
    report: Report,
    start: number,
    end: number,
    query: string,
    previousPage: CombatEventPage = null
  ): Observable<HttpResult<CombatEventPage>> {
    return this.get(`report/events/${report.id}`, {
      api_key: this.apiKey,
      start: start,
      end: end,
      filter: query
    })
      .map(response => {
        const page = response.data;
        if (!previousPage) {
          return new OkHttpResult<CombatEventPage>(response.status, page);
        }
        return new OkHttpResult<CombatEventPage>(
          response.status,
          new CombatEventPage(
            previousPage.events.concat(page.events),
            page.nextPageTimestamp
          )
        );
      })
      .catch(error => this.handleError<CombatEventPage>(error));
  }

  private getQuery(eventConfigs: EventConfig[]): string {
    const queries = this.eventConfigService
      .combineFilters(eventConfigs.map(x => x.filter))
      .map(x => x.parse());
    queries.push("type = 'combatantinfo'");
    const query = this.joinQueries(queries);

    return query;
  }

  private joinQueries(queries: string[]): string {
    return `(${queries.join(') or (')})`;
  }
}

export class CombatEventPage {
  constructor(public events: CombatEvent[], public nextPageTimestamp: number) {}
}
