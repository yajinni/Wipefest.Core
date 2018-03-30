import { Hit } from '../../hit';
import { MarkupHelper } from '../../../../markup/markup-helper';

export class Echoes extends Hit {
  constructor(id: string) {
    super(
      id,
      2052,
      ['Fel Echoes', 'Light Echoes'],
      [238037, 238420],
      null,
      null,
      `When ${MarkupHelper.Style('boss', 'Maiden of Vigilance')} casts
{ability:241635:Hammer of Creation:physical} or {ability:241636:Hammer of Obliteration:physical},
she leaves behind a pool of {ability:0:Light Remanence:holy} or {ability:0:Fel Remanence:fire}.
As this pool shrinks, {ability:238037:Light Echoes:holy} or {ability:238420:Fel Echoes:fire}
appear as swirls beneath the feet of players.
Moving out of these before they land will reduce unnecessary damage.`
    );
  }
}
