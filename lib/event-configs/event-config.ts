export class EventConfigIndex {
  zone: string;
  name: string;
  id: number;
  includes: string[];
}

export class EventConfig {
  // Identifiers
  id: string;
  name: string;

  // Basic configuration
  tags: string[];
  show: boolean;
  eventType: string;
  friendly: boolean;
  filter: EventConfigFilter;

  // Further configuration
  difficulties: number[];
  target: string;
  showTarget: boolean;
  includePetTargets: boolean;
  source: string;
  showSource: boolean;
  title: string;

  // Rare configuration
  timestamp: number;
  timestamps: number[];
  titles: string[];
  collapsed: boolean;
  icon: string;
  style: string;

  // Non-configurable
  file: string;
  group: string;
  showByDefault: boolean;
  collapsedByDefault: boolean;

  public constructor(init?: Partial<EventConfig>) {
    Object.assign(this, init);
  }
}

export class EventConfigFilter {
  // Basic configuration
  type: string;
  types: string[];
  ability: EventConfigFilterAbility;
  actor: EventConfigFilterActor;

  // Further configuration
  first: boolean;
  firstPerInstance: boolean;
  index: number;
  minimum: number;
  range: number;
  rangePerActor: number;
  stack: number;
  query: string;
}

export class EventConfigCombinedFilter {
  constructor(
    public type: string,
    public stack: number,
    public filters: EventConfigFilter[],
    public query: string = null
  ) {}

  parse(): string {
    if (this.query) {
      return this.query;
    }

    if (this.type === 'firstseen') {
      const actorGuids = this.filters.map(x => x.actor.id);
      return (
        `(source.firstSeen = timestamp and source.id in (${actorGuids.join(
          ', '
        )})) or ` +
        `(target.firstSeen = timestamp and target.id in (${actorGuids.join(
          ', '
        )}))`
      );
    }

    if (this.type === 'percent') {
      const filters = this.filters.map(
        x =>
          `source.id = ${x.actor.id} and resources.hpPercent <= ${x.actor
            .percent + 1} and resources.hpPercent >= ${x.actor.percent - 5}`
      );
      return `type in ('cast', 'applybuff', 'applydebuff') and (${filters.join(
        ') or ('
      )})`;
    }

    if (this.type === 'interrupt') {
      return `type = 'interrupt'`;
    }

    let query = `type = '${this.type}' and ability.id in (${this.filters
      .map(x => x.ability)
      .map(x => [].concat.apply([], x.ids ? x.ids : [x.id]))
      .join(', ')})`;

    if (this.stack && this.stack > 0) {
      query += ` and stack = ${this.stack}`;
    }

    return query;
  }
}

export class EventConfigFilterAbility {
  id: number;
  ids: number[];
}

export class EventConfigFilterActor {
  id: number;
  name: string;
  percent: number;
}
