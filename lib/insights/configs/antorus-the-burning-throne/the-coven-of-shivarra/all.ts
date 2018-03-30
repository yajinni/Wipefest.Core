import { InsightConfig } from '../../insight-config';
import { Hit } from '../../hit';
import { Debuff } from '../../debuff';
import { HitWithoutDebuff } from '../../hit-without-debuff';
import { DebuffUnlessRole } from '../../debuff-unless-role';
import { Interrupt } from '../../interrupt';

export namespace TheCovenOfShivarraInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      // Fiery Strike 244899 stacks too high
      // Flashfreeze 245518 stacks too high
      new DebuffUnlessRole('0', 2073, ['Fiery Strike'], [244899], 'Tank'),
      new DebuffUnlessRole('1', 2073, ['Flashfreeze'], [244899], 'Tank'),

      new Hit('2', 2073, ['Fury of Golganneth'], [246770]),
      new Hit('3', 2073, ['Spectral Army of Norgannon'], [245921]),
      new Hit('4', 2073, ["Flames of Khaz'goroth"], [245674]),

      new Hit('5', 2073, ['Shadow Blades'], [246374]),
      new Hit('6', 2073, ['Whirling Saber'], [245634]),
      new HitWithoutDebuff(
        '7',
        2073,
        ['Fulminating Burst'],
        [253588],
        ['Fulminating Pulse'],
        [253520],
        15000
      ),
      new Debuff('8', 2073, ['Chilled Blood (Frozen)'], [256356]),
      new HitWithoutDebuff(
        '9',
        2073,
        ['Cosmic Glare'],
        [250912],
        ['Cosmic Glare'],
        [250757],
        8000,
        null,
        null,
        `
On mythic difficulty, {npc:Thu'raya} debuffs two players with {ability:250912:Cosmic Glare:fire}.
Shortly after, a fel beam is conjured between those two players,
damaging them and anyone caught in the beam.
The two debuffed players should position themselves away from the raid,
so that no players are inbetween them.`
      ),

      new Interrupt('A', 2073, ['Touch of the Cosmos'], [250648])
    ];
  }
}
