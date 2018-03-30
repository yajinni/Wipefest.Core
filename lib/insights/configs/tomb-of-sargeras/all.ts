import { InsightConfig } from '../insight-config';
import { GorothInsightConfigs } from '../tomb-of-sargeras/goroth/all';
import { DemonicInquisitionInsightConfigs } from '../tomb-of-sargeras/demonic-inquisition/all';
import { MistressSasszineInsightConfigs } from '../tomb-of-sargeras/mistress-sasszine/all';
import { MaidenOfVigilanceInsightConfigs } from '../tomb-of-sargeras/maiden-of-vigilance/all';
import { SistersOfTheMoonInsightConfigs } from '../tomb-of-sargeras/sisters-of-the-moon/all';

export namespace TombOfSargerasInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      ...GorothInsightConfigs.All(),
      ...DemonicInquisitionInsightConfigs.All(),
      ...SistersOfTheMoonInsightConfigs.All(),
      ...MistressSasszineInsightConfigs.All(),
      ...MaidenOfVigilanceInsightConfigs.All()
    ];
  }
}
