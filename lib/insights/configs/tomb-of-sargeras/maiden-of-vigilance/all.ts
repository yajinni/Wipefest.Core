import { InsightConfig } from '../../insight-config';
import { Echoes } from '../../tomb-of-sargeras/maiden-of-vigilance/echoes';
import { UnstableSoulFullExpirationExplosion } from '../../tomb-of-sargeras/maiden-of-vigilance/unstable-soul-full-expiration-explosion';
import { UnstableSoulEarlyExpirationExplosion } from '../../tomb-of-sargeras/maiden-of-vigilance/unstable-soul-early-expiration-explosion';
import { CreatorsGrace } from '../../tomb-of-sargeras/maiden-of-vigilance/creators-grace';
import { Orbs } from '../../tomb-of-sargeras/maiden-of-vigilance/orbs';
import { UnstableSoulGainsFromEchoes } from '../../tomb-of-sargeras/maiden-of-vigilance/unstable-soul-gains-from-echoes';
import { UnnecessaryUnstableSoulGains } from '../../tomb-of-sargeras/maiden-of-vigilance/unnecessary-unstable-soul-gains';
import { FellInHole } from '../../tomb-of-sargeras/maiden-of-vigilance/fell-in-hole';
import { TitanicBulwark } from '../../tomb-of-sargeras/maiden-of-vigilance/titanic-bulwark';

export namespace MaidenOfVigilanceInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new UnnecessaryUnstableSoulGains('0'),
      new Echoes('1'),
      new UnstableSoulGainsFromEchoes('2'),
      new UnstableSoulFullExpirationExplosion('3'),
      new UnstableSoulEarlyExpirationExplosion('4'),
      new Orbs('5'),
      new CreatorsGrace('6'),
      new FellInHole('7'),
      new TitanicBulwark('8')
    ];
  }
}
