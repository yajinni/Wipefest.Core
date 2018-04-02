import { Insight } from '../models/insight';
import { Ability } from '../../fight-events/models/ability-event';
import { MarkupHelper } from '../../markup/markup-helper';
import { PlayerAndFrequency } from '../models/player-and-frequency';
import { InsightContext } from '../../insights/models/insight-context';
import { FightEvent } from '../../fight-events/models/fight-event';
import { Actor } from '../../reports/report';
import { Raid, Player } from '../../raid/raid';

export abstract class InsightConfig {
  constructor(
    public id: string,
    public boss: number,
    protected insightTemplate,
    protected detailsTemplate,
    protected tipTemplate,
    protected major: boolean = false
  ) {}

  getInsight(context: InsightContext): Insight {
    const properties = this.getProperties(context);
    if (properties === null) {
      return null;
    }

    return this.generateInsight(
      this.id,
      this.boss,
      this.insightTemplate,
      this.detailsTemplate,
      this.tipTemplate,
      this.major,
      properties,
      context.events
    );
  }

  abstract getProperties(context: InsightContext): any;

  protected renderTemplate(
    template: string,
    properties: any,
    events: FightEvent[]
  ) {
    if (template === null) return null;

    const abilityMatches = this.getMatches(
      /{ability:(.+?):(.+?):(.+?)}/g,
      template
    );
    for (let i = 0; i < abilityMatches.length; i++) {
      const abilityMatch = abilityMatches[i];
      template = template
        .split(abilityMatch[0])
        .join(
          this.getAbilityMarkup(
            events,
            +abilityMatch[1],
            abilityMatch[2],
            abilityMatch[3]
          )
        );
    }

    const npcMatches = this.getMatches(/{npc:(.+?)}/g, template);
    for (let i = 0; i < npcMatches.length; i++) {
      const npcMatch = npcMatches[i];
      template = template
        .split(npcMatch[0])
        .join(MarkupHelper.Style('npc', npcMatch[1]));
    }

    for (let i = 0; i < 2; i++) {
      // Let properties have properties embedded in them by iterating twice
      for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
          template = template.split(`{${property}}`).join(properties[property]);
        }
      }
    }

    return template;
  }

  protected generateInsight(
    id: string,
    boss: number,
    insightTemplate: string,
    detailsTemplate: string,
    tipTemplate: string,
    major: boolean,
    properties: any,
    events: FightEvent[]
  ): Insight {
    const insight = this.renderTemplate(insightTemplate, properties, events);
    const details = this.renderTemplate(detailsTemplate, properties, events);
    const tip = this.renderTemplate(tipTemplate, properties, events);

    return new Insight(id, boss, insight, details, tip, major);
  }

  protected getAbilitiesIfTheyExist(
    events: any[],
    abilityIds: number[]
  ): Ability[] {
    const abilities: Ability[] = [];

    abilityIds.forEach(id => {
      const event = events.find(x => x.ability && x.ability.guid === id);
      if (event) abilities.push(event.ability);
    });

    return abilities;
  }

  protected getPlayersAndFrequenciesFromTarget(
    events: any[]
  ): PlayerAndFrequency[] {
    const players = events
      .map(x => x.target)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndFrequencies = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: events.filter(x => x.target.id === player.id).length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);

    return playersAndFrequencies;
  }

  protected getPlayersAndFrequenciesFromSource(
    events: any[]
  ): PlayerAndFrequency[] {
    const players = events
      .map(x => x.source)
      .filter(
        (x, index, array) => array.findIndex(y => y.id === x.id) === index
      );
    const playersAndFrequencies = players
      .map(
        player =>
          <any>{
            player: player,
            frequency: events.filter(x => x.source.id === player.id).length
          }
      )
      .sort((x, y) => y.frequency - x.frequency);

    return playersAndFrequencies;
  }

  protected getAbilityMarkup(
    events: any[],
    abilityId: number,
    name: string,
    style: string
  ): string {
    return MarkupHelper.AbilityWithTooltip2(abilityId, name, style);
  }

  protected getPlural(number: number): string {
    if (number === 1) return '';

    return 's';
  }

  protected getPlayerFromActor(actor: Actor, raid: Raid): Player {
    return raid.players.find(x => x.name === actor.name);
  }

  private getMatches(regex: RegExp, input: string) {
    const matches: string[][] = [];

    let m;
    while ((m = regex.exec(input)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      matches.push(m.map(x => x));
    }

    return matches;
  }
}
