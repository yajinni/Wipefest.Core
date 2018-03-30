import { InsightConfig } from '../insight-config';
import { GarothiWorldbreakerInsightConfigs } from '../antorus-the-burning-throne/garothi-worldbreaker/all';
import { FelhoundsOfSargerasInsightConfigs } from '../antorus-the-burning-throne/felhounds-of-sargeras/all';
import { AntoranHighCommandInsightConfigs } from '../antorus-the-burning-throne/antoran-high-command/all';
import { PortalKeeperHasabelInsightConfigs } from '../antorus-the-burning-throne/portal-keeper-hasabel/all';
import { TheDefenseOfEonarInsightConfigs } from '../antorus-the-burning-throne/the-defense-of-eonar/all';
import { ImonarTheSoulHunterInsightConfigs } from '../antorus-the-burning-throne/imonar-the-soulhunter/all';
import { KingarothInsightConfigs } from '../antorus-the-burning-throne/kingaroth/all';
import { VarimathrasInsightConfigs } from '../antorus-the-burning-throne/varimathras/all';
import { TheCovenOfShivarraInsightConfigs } from '../antorus-the-burning-throne/the-coven-of-shivarra/all';
import { AggramarInsightConfigs } from '../antorus-the-burning-throne/aggramar/all';
import { ArgusTheUnmakerInsightConfigs } from '../antorus-the-burning-throne/argus-the-unmaker/all';

export namespace AntorusTheBurningThroneInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      ...GarothiWorldbreakerInsightConfigs.All(),
      ...FelhoundsOfSargerasInsightConfigs.All(),
      ...AntoranHighCommandInsightConfigs.All(),
      ...PortalKeeperHasabelInsightConfigs.All(),
      ...TheDefenseOfEonarInsightConfigs.All(),
      ...ImonarTheSoulHunterInsightConfigs.All(),
      ...KingarothInsightConfigs.All(),
      ...VarimathrasInsightConfigs.All(),
      ...TheCovenOfShivarraInsightConfigs.All(),
      ...AggramarInsightConfigs.All(),
      ...ArgusTheUnmakerInsightConfigs.All()
    ];
  }
}
