import { Hit } from '../../hit';
import { MarkupHelper } from '../../../../markup/markup-helper';

export class GlaiveStorm extends Hit {
  constructor(id: string) {
    super(
      id,
      2050,
      ['Glaive Storm'],
      [236480],
      null,
      null,
      `{abilityTooltips} is cast by ${MarkupHelper.Style(
        'boss',
        'Huntress Kasparian'
      )},
so watch her position before it casts (be aware that she might teleport just before she casts it).
When {abilityTooltips} reaches the edge of the room, it splits into 3 smaller glaives that bounce back.
When these smaller glaives reach the edge of the room, they each split into 3 even smaller glaives that bounce back.
This is the hardest part of this ability. The enrage timer is not usually an issue in this encounter,
so, if necessary, be sure to focus more on your dodging than your throughput.
Sometimes, {ability:236541:Twilight Glaive:shadow} can overlap with the end of {abilityTooltips},
so pay attention to the positioning for that as well.
Once all of the glaives have passed, you can usually move back into your regular position.`
    );
  }
}
