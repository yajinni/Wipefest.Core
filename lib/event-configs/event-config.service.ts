import {
  EventConfigFilter,
  EventConfigCombinedFilter,
  EventConfig,
  EventConfigIndex
} from './event-config';
import { Observable } from 'rxjs/Observable';
import { SpecializationsService } from '../specializations/specializations.service';
import { EncountersService } from '../encounters/encounters.service';
import { Raid } from '../raid/raid';
import { Actor } from '../reports/report';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/fromPromise';
import { AxiosInstance, AxiosResponse } from 'axios';

export class EventConfigService {
  constructor(
    private encountersService: EncountersService,
    private specializationsService: SpecializationsService,
    private http: AxiosInstance
  ) {}

  private get<T>(url: string): Observable<AxiosResponse<T>> {
    return Observable.fromPromise(this.http.get<T>(url));
  }

  getIncludesForBoss(bossId: number): Observable<string[]> {
    return this.getEventConfigIndex().map(
      x => x.find(boss => boss.id === bossId).includes
    );
  }

  getIncludesForFocuses(
    focuses: number[],
    friendlies: Actor[],
    raid: Raid
  ): string[] {
    if (!focuses || !friendlies || !raid) return [];

    return raid.players
      .filter(x => {
        const friendly = friendlies.find(f => f.name === x.name);
        return friendly && focuses.indexOf(friendly.id) !== -1;
      })
      .map(x => [x.specialization.include, x.specialization.generalInclude])
      .reduce((x, y) => x.concat(y))
      .filter((x, index, array) => array.indexOf(x) === index);
  }

  getEventConfigs(includes: string[]): Observable<EventConfig[]> {
    const batch: Observable<EventConfig[]>[] = [];

    includes.forEach(include => {
      const observable = this.get<any>(include + '.json')
        .map(response => {
          const configs = response.data.map(config => {
            config.showByDefault = config.show;
            config.collapsedByDefault = config.collapsed === true;
            config.file = include;
            config.group = this.fileToGroup(include);
            return config;
          });
          return configs;
        })
        .catch(error => this.handleError(error));

      batch.push(observable);
    });

    return Observable.forkJoin(batch).map(x => [].concat.apply([], x)); // Flatten arrays into one array
  }

  private fileToGroup(file: string): string {
    const encounters = this.encountersService.getEncounters();

    switch (file) {
      case 'general/raid':
        return 'R';
      case 'general/focus':
        return 'F';
      case 'general/tank':
        return 'T';
      case 'general/healer':
        return 'H';
      case 'general/ranged':
        return 'RA';
      case 'general/melee':
        return 'M';
    }

    for (let i = 0; i < encounters.length; i++) {
      const encounter = encounters[i];
      const normalizedFile = this.normalize(file);
      const normalizedName = this.normalize(encounter.name);
      if (normalizedFile.indexOf(normalizedName) !== -1) {
        return encounter.id.toString();
      }
    }

    for (
      let i = 0;
      i < this.specializationsService.getSpecializations().length;
      i++
    ) {
      const specialization = this.specializationsService.getSpecializations()[
        i
      ];
      if (file === specialization.include) {
        return specialization.group;
      }
      if (file === specialization.generalInclude) {
        return specialization.generalGroup;
      }
    }

    return 'ungrouped';
  }

  private normalize(name: string): string {
    return name
      .split(' ')
      .join('')
      .split('-')
      .join('')
      .split("'")
      .join('')
      .toLowerCase();
  }

  private getEventConfigIndex(): Observable<EventConfigIndex[]> {
    return this.get<any>('index.json')
      .map(response => response.data)
      .catch(error => this.handleError(error));
  }

  private handleError(error: Response | any): Observable<Response> {
    return Observable.throw(error);
  }

  combineFilters(
    eventConfigFilters: EventConfigFilter[]
  ): EventConfigCombinedFilter[] {
    const combinedFilters: EventConfigCombinedFilter[] = [];

    eventConfigFilters.filter(x => x !== undefined).forEach(filter => {
      if (!filter.types) {
        filter.types = [filter.type];
      }

      filter.types.forEach(type => {
        if (
          filter.query &&
          !combinedFilters.some(x => x.query === filter.query)
        ) {
          combinedFilters.push(
            new EventConfigCombinedFilter(
              type,
              filter.stack ? filter.stack : 0,
              [filter],
              filter.query
            )
          );
        } else {
          const index = combinedFilters.findIndex(
            x =>
              !x.query &&
              x.type === type &&
              x.stack === (filter.stack ? filter.stack : 0)
          );

          if (index !== -1) {
            combinedFilters[index].filters.push(filter);
          } else {
            combinedFilters.push(
              new EventConfigCombinedFilter(
                type,
                filter.stack ? filter.stack : 0,
                [filter]
              )
            );
          }
        }
      });
    });

    return combinedFilters;
  }
}