import { InsightConfig } from '../configs/insight-config';
import { DamageEvent } from '../../fight-events/models/damage-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { InsightContext } from '../models/insight-context';
import { TimestampAndPlayers } from '../models/timestamp-and-players';
import { Timestamp } from '../../helpers/timestamp-helper';
import { SortRaid } from '../../raid/raid';
import { AbilityEvent } from '../../fight-events/models/ability-event';
import { PlayerAndFrequency } from '../models/player-and-frequency';

export class ClosestHit extends InsightConfig {
  constructor(
    id: string,
    boss: number,
    private damageEventConfigNames: string[],
    private abilityIds: number[],
    private abilityEventConfigNames: string[],
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate = 'Triggered {abilities} {total} time{plural}.';
    if (detailsTemplate === null)
      this.detailsTemplate =
        '<h6>Closest</h6><p>{closestPlayersAndFrequencies}</p><h6>All Hit</h6><p>{allHitPlayersAndFrequencies}</p> {timestampsAndPlayersTable}';
  }

  getProperties(context: InsightContext): any {
    const damageEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.damageEventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'damage'
      )
      .map(x => <DamageEvent>x);

    if (damageEvents.length === 0) {
      return null;
    }

    const triggers: DamageEvent[][] = [];
    let trigger = [damageEvents[0]];
    damageEvents.slice(1).forEach(x => {
      if (x.timestamp < trigger[0].timestamp + 100) {
        trigger.push(x);
      } else {
        triggers.push(trigger);
        trigger = [x];
      }
    });
    triggers.push(trigger);

    if (triggers.length === 0) {
      return null;
    }

    const abilities = this.getAbilitiesIfTheyExist(
      damageEvents,
      this.abilityIds
    );
    const total = triggers.length;

    const allHitPlayers = damageEvents
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const allHitPlayersAndFrequencies = allHitPlayers
      .map(
        player =>
          <any>{
            player: player,
            frequency: damageEvents.filter(x => x.target.id === player.id)
              .length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);
    const timestampsAndSoakingPlayers = triggers.map(
      x =>
        new TimestampAndPlayers(
          x[0].timestamp,
          x
            .map(y => this.getPlayerFromActor(y.target, context.raid))
            .sort(SortRaid.ByClassThenSpecializationThenName)
        )
    );

    const abilityEvents = context.events
      .filter(x => x.config)
      .filter(
        x =>
          this.abilityEventConfigNames.indexOf(x.config.name) !== -1 &&
          x.config.eventType === 'ability'
      )
      .map(x => <AbilityEvent>x)
      .reverse();

    const closestPlayers = triggers.map(trigger => {
      const abilityEvent = abilityEvents.find(
        x =>
          x.source.id === trigger[0].source.id &&
          x.source.instance === trigger[0].source.instance &&
          x.timestamp <= trigger[0].timestamp
      );

      if (!abilityEvent) {
        return null;
      }

      let closest = trigger[0].target;
      let closestDistance = 100000000;

      for (let i = 0; i < trigger.length; i++) {
        const damageEvent = trigger[i];
        const distance = this.distanceBetween(
          damageEvent.x,
          damageEvent.y,
          abilityEvent.x,
          abilityEvent.y
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = damageEvent.target;
        }
      }

      return closest;
    });

    const closestPlayersAndFrequencies = closestPlayers
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      )
      .map(
        x =>
          new PlayerAndFrequency(
            x,
            closestPlayers.filter(y => y.id === x.id).length
          )
      )
      .sort((x, y) => y.frequency - x.frequency);

    const timestampsAndPlayersTable = new MarkupHelper.Table(
      timestampsAndSoakingPlayers.map(
        (x, index) =>
          new MarkupHelper.TableRow([
            new MarkupHelper.TableCell(
              Timestamp.ToMinutesAndSeconds(x.timestamp)
            ),
            new MarkupHelper.TableCell(
              MarkupHelper.Actor(closestPlayers[index])
            ),
            new MarkupHelper.TableCell(
              x.players.map(p => MarkupHelper.Player(p)).join(', ')
            )
          ])
      ),
      new MarkupHelper.TableRow([
        new MarkupHelper.TableCell('Time'),
        new MarkupHelper.TableCell('Closest'),
        new MarkupHelper.TableCell('All Hit')
      ]),
      'table table-hover markup-table-details'
    );

    return {
      abilities: MarkupHelper.AbilitiesWithIcons(abilities),
      abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
      timestampsAndPlayersTable: timestampsAndPlayersTable.parse(),
      total: MarkupHelper.Info(total),
      plural: this.getPlural(total),
      closestPlayersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        closestPlayersAndFrequencies
      ),
      allHitPlayersAndFrequencies: MarkupHelper.PlayersAndFrequencies(
        allHitPlayersAndFrequencies
      )
    };
  }

  private distanceBetween(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    const a = x1 - x2;
    const b = y1 - y2;

    const c = Math.sqrt(a * a + b * b);

    return c;
  }
}
