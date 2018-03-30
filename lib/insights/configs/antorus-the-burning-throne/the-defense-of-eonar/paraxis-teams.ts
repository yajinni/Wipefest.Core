import { InsightConfig } from '../../insight-config';
import { MarkupHelper } from '../../../../markup/markup-helper';
import { InsightContext } from '../../../models/insight-context';
import { PlayerAndAbility } from '../../../models/player-and-ability';
import { DebuffEvent } from 'fight-events/models/debuff-event';

export class ParaxisTeams extends InsightConfig {
  constructor(id: string) {
    super(
      id,
      2075,
      `Sent {total} team{plural} to board the Paraxis.`,
      `{teams}`,
      `
On Mythic difficulty, the Paraxis attempts to cast {ability:249121:Final Doom:physical}.
To prevent this, teams of 4 should teleport to the Paraxis
(by standing on crystals that spawn near ${MarkupHelper.Style('npc', 'Eonar')}).
On the Paraxis, the team should kill the ${MarkupHelper.Style(
        'npc',
        'Paraxis Inquisitor'
      )},
click on one of 4 crystals to gain a particular debuff,
and then use {ability:245781:Surge of Life:physical} to jump off of the ship.
You cannot have more than one of these debuffs,
so you will need to send 4 teams,
each ideally consisting of 1 healer and 3 DPS.`
    );
  }

  getProperties(context: InsightContext): any {
    if (context.fightInfo.difficulty !== 5) return null;

    const eventConfigNames = [
      'Feedback - Foul Steps',
      'Feedback - Arcane Singularity',
      'Feedback - Targeted',
      'Feedback - Burning Embers'
    ];

    const events = eventConfigNames.map(eventConfigName =>
      context.events
        .filter(x => x.config)
        .filter(
          x =>
            x.config.name === eventConfigName && x.config.eventType === 'debuff'
        )
        .map(x => <DebuffEvent>x)
    );

    const total = Math.max(...events.map(x => x.length));

    const teams: PlayerAndAbility[][] = [];
    for (let i = 0; i < total; i++) {
      const team = [];
      for (let j = 0; j < events.length; j++) {
        if (events[j].length > i) {
          team.push(
            new PlayerAndAbility(events[j][i].target, events[j][i].ability)
          );
        }
      }
      teams.push(team);
    }

    const table = new MarkupHelper.Table(
      teams.map(
        (team, index) =>
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell((index + 1).toString()),
            new MarkupHelper.TableCell(MarkupHelper.PlayersAndAbilities(team))
          ])
      ),
      new MarkupHelper.TableRow([
        new MarkupHelper.TableCell('#'),
        new MarkupHelper.TableCell('Team')
      ]),
      'table table-hover markup-table-details'
    );

    return {
      total: MarkupHelper.Info(total),
      plural: this.getPlural(total),
      teams: table.parse()
    };
  }
}
