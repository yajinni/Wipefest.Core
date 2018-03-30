import { InsightConfig } from '../configs/insight-config';
import { DamageEvent } from '../../fight-events/models/damage-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';
import { TimestampAndPlayers } from '../models/timestamp-and-players';
import { Timestamp } from '../../helpers/timestamp-helper';
import { SortRaid } from '../../raid/raid';

export class Soak extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private eventConfigNames: string[],
    private abilityIds: number[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        'Soaked {abilities} with an average of {average}/{raidSize} player{plural}.';
    if (detailsTemplate === null)
      this.detailsTemplate =
        '<p>{playersAndFrequencies}</p> {timestampsAndPlayersTable}';
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.eventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'damage'
      )
      .map(x => <DamageEvent>x);

    if (damageEvents.length === 0) {
      return null;
    }

    const soaks: DamageEvent[][] = [];
    let soak = [damageEvents[0]];
    damageEvents.slice(1).forEach(x => {
      if (x.timestamp < soak[0].timestamp + 1500) {
        soak.push(x);
      } else {
        soaks.push(soak);
        soak = [x];
      }
    });
    soaks.push(soak);

    if (soaks.length === 0) {
      this.insightTemplate = 'Failed to soak {abilities}.';
      this.detailsTemplate = null;
    }

    const abilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.abilityIds
    );
    const average =
      soaks.map(x => x.length).reduce((x, y) => x + y) / soaks.length;

    const players = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndFrequencies = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: damageEvents.filter(x => x.target.id === player.id)
              .length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);

    const timestampsAndSoakingPlayers = soaks.map(
      x =>
        new TimestampAndPlayers(
          x[0].timestamp,
          x
            .map(y => this.getPlayerFromActor(y.target, context.raid))
            .sort(SortRaid.ByClassThenSpecializationThenName)
        )
    );
    const timestampsAndNonSoakingPlayers = soaks.map(
      x =>
        new TimestampAndPlayers(
          x[0].timestamp,
          context.raid.players
            .filter(p => !x.map(y => y.target).some(t => p.name === t.name))
            .sort(SortRaid.ByClassThenSpecializationThenName)
        )
    );

    const timestampsAndPlayersTable = new MarkupHelper.Table(
      timestampsAndSoakingPlayers.map(
        (x, index) =>
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell(
              Timestamp.ToMinutesAndSeconds(x.timestamp)
            ),
            new MarkupHelper.TableCell(
              x.players.map(p => MarkupHelper.Player(p)).join(', ')
            ),
            new MarkupHelper.TableCell(
              timestampsAndNonSoakingPlayers[index].players
                .map(p => MarkupHelper.Player(p))
                .join(', ')
            )
          ])
      ),
      new MarkupHelper.TableRow([
        new MarkupHelper.TableCell('Time'),
        new MarkupHelper.TableCell('Soaked'),
        new MarkupHelper.TableCell("Didn't Soak")
      ]),
      'table table-hover markup-table-details'
    );

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      timestampsAndPlayersTable: timestampsAndPlayersTable.parse(),
      plural: this.getPlural(average),
      average: MarkupHelper.Info(average.toFixed(1)),
      raidSize: context.raid.players.length,
      playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        playersAndFrequencies
      )
    };
  }
}
