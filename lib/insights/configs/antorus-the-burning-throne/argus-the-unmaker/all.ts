import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { Debuff } from '../../debuff';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffUnlessRole } from '../../debuff-unless-role';
import { DebuffDuration } from '../../debuff-duration';
import { Interrupt } from '../../interrupt';
import { Death } from '../../death';

export namespace ArgusTheUnmakerInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      // Sweeping Scythe 248499 stacks too high
      // Deadly Scythe 258039 stacks too high
      // Strength of the Sky 253903 max stacks per player
      // Strength of the Sea 253901 max stacks per player
      new DebuffUnlessRole(
        '0',
        2092,
        ['Sweeping Scythe', 'Deadly Scythe'],
        [248499, 258039],
        'Tank'
      ),
      new Hit('1', 2092, ['Death Fog'], [248167]),
      new DebuffDuration(
        '2',
        2092,
        'Strength of the Sky',
        'Strength of the Sky (Removed)'
      ),
      new DebuffDuration(
        '3',
        2092,
        'Strength of the Sea',
        'Strength of the Sea (Removed)'
      ),

      // Soulbomb 251570 target has Aggramar's Boon 255200 when Soulbomb Detonation 251571
      new Debuff('4', 2092, ['Edge of Obliteration'], [251815]),

      // Cosmic Power 255935 debuff on non-casting Constellar Designates
      new Interrupt('5', 2092, ['Cosmic Beacon'], [252616]),
      new HitWithoutDebuff(
        '6',
        2092,
        ['Cosmic Ray'],
        [252707],
        ['Cosmic Ray'],
        [252729],
        10000
      ),

      // Ember of Rage 257299 debuff duration / debuff stacks?
      // Reorigination Module average lifespan
      // Soul Detonation 256899 debuffs
      // Withering Roots 256399 max stack
      new Debuff('7', 2092, ['Ember of Rage'], [257299]),
      new Death('8', 2092, [256396]),
      new Debuff('9', 2092, ['Soul Detonation'], [256899])
    ];
  }
}
