import { Observable } from 'rxjs/Observable';
import { Report, FightInfo } from '../reports/report';
import { Death } from '../deaths/death';

export interface IDeathService {
  getDeaths(report: Report, fight: FightInfo): Observable<Death[]>;
}
