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
import { AxiosInstance, AxiosResponse } from 'axios';
import { HttpService } from 'infrastructure/http.service';
import {
  HttpResult,
  OkHttpResult,
  ErrorHttpResult
} from 'infrastructure/result';

export class EventConfigService extends HttpService {
  constructor(
    private encountersService: EncountersService,
    private specializationsService: SpecializationsService,
    http: AxiosInstance
  ) {
    super(http);
  }

  getIncludesForBoss(bossId: number): Observable<HttpResult<string[]>> {
    return this.getEventConfigIndex().map(x => {
      if (x.isFailure) return new ErrorHttpResult<string[]>(x.status, x.error);

      return new OkHttpResult<string[]>(
        x.status,
        x.value.find(boss => boss.id === bossId).includes
      );
    });
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

  getEventConfigs(includes: string[]): Observable<HttpResult<EventConfig[]>> {
    const batch: Observable<HttpResult<EventConfig[]>>[] = [];

    includes.forEach(include => {
      const observable = this.get(include + '.json', {})
        .map(response => {
          const configs = response.data.map(config => {
            config.showByDefault = config.show;
            config.collapsedByDefault = config.collapsed === true;
            config.file = include;
            config.group = this.fileToGroup(include);
            return config;
          });
          return new OkHttpResult<EventConfig[]>(response.status, configs);
        })
        .catch(error => this.handleError<EventConfig[]>(error));

      batch.push(observable);
    });

    return Observable.forkJoin(batch).map(results => {
      const failedResults = results.filter(result => result.isFailure);
      if (failedResults.length > 0) {
        return new ErrorHttpResult<EventConfig[]>(
          failedResults[0].status,
          failedResults.map(result => result.error).join(', ')
        );
      }

      const configs = [].concat.apply([], results.map(result => result.value)); // Flatten arrays into one array
      return new OkHttpResult<EventConfig[]>(results[0].status, configs);
    });
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
      default:
        break;
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

  private getEventConfigIndex(): Observable<HttpResult<EventConfigIndex[]>> {
    return this.get('index.json', {})
      .map(
        response =>
          new OkHttpResult<EventConfigIndex[]>(response.status, response.data)
      )
      .catch(error => this.handleError<EventConfigIndex[]>(error));
  }
}
