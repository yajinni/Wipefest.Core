import { InsightConfig } from '../../insight-config';
import { GlaiveStorm } from '../../tomb-of-sargeras/sisters-of-the-moon/glaive-storm';
import { AstralVulnerability } from '../../tomb-of-sargeras/sisters-of-the-moon/astral-vulnerability';
import { TwilightGlaive } from '../../tomb-of-sargeras/sisters-of-the-moon/twilight-glaive';
import { MoonBurn } from '../../tomb-of-sargeras/sisters-of-the-moon/moon-burn';

export namespace SistersOfTheMoonInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      new TwilightGlaive('0'),
      new GlaiveStorm('1'),
      new AstralVulnerability('2'),
      new MoonBurn('3')
    ];
  }
}
