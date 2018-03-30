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
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/fromPromise';
import { AxiosInstance, AxiosResponse } from 'axios';

export class WarcraftLogsCombatEventService implements ICombatEventService {
  constructor(
    private eventConfigService: EventConfigService,
    private http: AxiosInstance,
    private apiKey: string
  ) {}

  private get<T>(url: string, params: any): Observable<AxiosResponse<T>> {
    return Observable.fromPromise(this.http.get<T>(url, { params: params }));
  }

  getCombatEvents(
    report: Report,
    fight: FightInfo,
    eventConfigs: EventConfig[]
  ): Observable<CombatEvent[]> {
    const query = this.getQuery(eventConfigs);
    return this.getPageOfCombatEvents(
      report,
      fight.start_time,
      fight.end_time,
      query
    )
      .expand(page => {
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
      .map(x => x.events)
      .last();
  }

  private getPageOfCombatEvents(
    report: Report,
    start: number,
    end: number,
    query: string,
    previousPage: CombatEventPage = null
  ): Observable<CombatEventPage> {
    return this.get<any>(`report/events/${report.id}`, {
      api_key: this.apiKey,
      start: start,
      end: end,
      filter: query
    })
      .map(response => {
        const page = response.data;
        if (!previousPage) {
          return page;
        }
        return new CombatEventPage(
          previousPage.events.concat(page.events),
          page.nextPageTimestamp
        );
      })
      .catch(error => this.handleError(error));
  }

  private getQuery(eventConfigs: EventConfig[]): string {
    const queries = this.eventConfigService
      .combineFilters(eventConfigs.map(x => x.filter))
      .map(x => x.parse());
    queries.push("type = 'combatantinfo'");
    const query = this.joinQueries(queries);

    return query;
  }

  private joinQueries(queries: string[]) {
    return `(${queries.join(') or (')})`;
  }

  private handleError(error: Response | any): Observable<Response> {
    return Observable.throw(error);
  }
}

export class CombatEventPage {
  constructor(public events: CombatEvent[], public nextPageTimestamp: number) {}
}
