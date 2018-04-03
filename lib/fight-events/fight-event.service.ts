import { EventConfig } from '../event-configs/event-config';
import { CombatEvent } from 'combat-events/combat-event';
import { Death } from 'deaths/death';
import { RemoveDebuffEvent } from '../fight-events/models/remove-debuff-event';
import { InterruptEvent } from '../fight-events/models/interrupt-event';
import { DebuffStackEvent } from '../fight-events/models/debuff-stack-event';
import { TitleEvent } from '../fight-events/models/title-event';
import { FightEvent } from '../fight-events/models/fight-event';
import { HeroismEvent } from '../fight-events/models/heroism-event';
import { AbilityEvent, Ability } from '../fight-events/models/ability-event';
import { DamageEvent } from '../fight-events/models/damage-event';
import { PhaseChangeEvent } from '../fight-events/models/phase-change-event';
import { DebuffEvent } from '../fight-events/models/debuff-event';
import { SpawnEvent } from '../fight-events/models/spawn-event';
import { DeathEvent } from '../fight-events/models/death-event';
import { FightInfo, Report, Actor } from '../reports/report';
import { EndOfFightEvent } from '../fight-events/models/end-of-fight-event';

export class FightEventService {
  constructor() {}

  getEvents(
    report: Report,
    fight: FightInfo,
    configs: EventConfig[],
    combatEvents: CombatEvent[],
    deaths: Death[],
    deathThreshold: number = 0
  ): FightEvent[] {
    let events: FightEvent[] = [].concat.apply(
      [],
      configs.map(config => {
        const matchingCombatEvents = this.filterToMatchingCombatEvents(
          config,
          combatEvents,
          fight,
          report
        );

        return this.getEventsForConfig(
          report,
          fight,
          config,
          matchingCombatEvents,
          deaths
        );
      })
    );

    if (deathThreshold > 0) {
      let deathEvents = events.filter(x => x.config.eventType == "death");
      if (deathEvents.length >= deathThreshold) {
        let deathThresholdTimestamp = deathEvents[deathThreshold - 1].timestamp;
        events = events.filter(x => x.timestamp <= deathThresholdTimestamp);
      }
    }

    if (!events.some(x => x.isInstanceOf(PhaseChangeEvent))) {
      events.push(new TitleEvent(0, 'Pull'));
    }
    events.push(
      new EndOfFightEvent(fight.end_time - fight.start_time, fight.kill)
    );
    events = this.sortEvents(events);

    return events;
  }

  private sortEvents(events: FightEvent[]): FightEvent[] {
    return events.sort((a: any, b: any) => {
      let sort = a.timestamp - b.timestamp;

      if (a.sequence && b.sequence) {
        sort = sort || a.sequence - b.sequence;
      }

      if (a.instance && b.instance) {
        sort = sort || a.instance - b.instance;
      }

      return sort;
    });
  }

  private getEventsForConfig(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[],
    deaths: Death[],
    timestampOffset: number = 0,
    isChild: boolean = false
  ): FightEvent[] {
    if (!config.difficulties) {
      config.difficulties = [3, 4, 5];
    }
    if (config.difficulties.indexOf(fight.difficulty) === -1) {
      return [];
    }

    switch (config.eventType) {
      case 'heroism':
        return this.getHeroismEvents(report, fight, config, combatEvents);
      case 'ability':
        return this.getAbilityEvents(report, fight, config, combatEvents);
      case 'damage':
        return this.getDamageEvents(
          report,
          fight,
          config,
          combatEvents,
          timestampOffset,
          isChild
        );
      case 'phase':
        return this.getPhaseChangeEvents(report, fight, config, combatEvents);
      case 'debuff':
        return this.getDebuffEvents(report, fight, config, combatEvents);
      case 'debuffstack':
        return this.getDebuffStackEvents(report, fight, config, combatEvents);
      case 'removedebuff':
        return this.getRemoveDebuffEvents(report, fight, config, combatEvents);
      case 'interrupt':
        return this.getInterruptEvents(report, fight, config, combatEvents);
      case 'spawn':
        return this.getSpawnEvents(report, fight, config, combatEvents);
      case 'death':
        return this.getDeathEvents(report, fight, config, deaths);
      case 'title':
        return this.getTitleEvents(report, fight, config, combatEvents);
      default: {
        throw new Error(`'${config.eventType}' is an unsupported event type`);
      }
    }
  }

  private getHeroismEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): HeroismEvent[] {
    const events = combatEvents
      .map(x => Math.ceil(x.timestamp / 1000))
      .filter(
        (x, index, array) =>
          array.indexOf(x) === index && array.filter(y => y === x).length >= 10
      ) // Only show if 10 or more people affected
      .map(
        x =>
          new HeroismEvent(
            config,
            x * 1000 - fight.start_time,
            new Ability(
              combatEvents.find(y => y.timestamp - x * 1000 < 1000).ability
            )
          )
      );

    return events;
  }

  private getAbilityEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): AbilityEvent[] {
    const events = combatEvents
      .map(
        x =>
          new AbilityEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly === undefined
              ? x.sourceIsFriendly
              : config.friendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            new Ability(x.ability),
            combatEvents.filter(
              y =>
                y.ability.name === x.ability.name && y.timestamp < x.timestamp
            ).length + 1,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.showTarget || false
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getDamageEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[],
    timestampOffset: number,
    isChild: boolean
  ): DamageEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DamageEvent(
            config,
            x.timestamp - fight.start_time + timestampOffset,
            config.friendly || x.sourceIsFriendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            new Ability(x.ability),
            x.amount,
            x.absorbed,
            x.overkill,
            isChild
          )
      )
      .filter(
        x =>
          x.target &&
          !(!config.includePetTargets && x.target.hasOwnProperty('petOwner'))
      );

    return events;
  }

  private getPhaseChangeEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): PhaseChangeEvent[] {
    const collapsed = config.collapsed === undefined ? false : config.collapsed;

    if (
      !config.filter &&
      config.timestamp < fight.end_time - fight.start_time
    ) {
      return [
        new PhaseChangeEvent(config, config.timestamp, config.name, !collapsed)
      ];
    }

    if (combatEvents.length === 0) return [];

    if (config.filter) {
      if (config.filter.type === 'percent') {
        const combatEvent = combatEvents
          .sort((a, b) => a.timestamp - b.timestamp)
          .find(
            x =>
              x.hitPoints * 100 / x.maxHitPoints <=
              config.filter.actor.percent + 1
          );

        if (combatEvent) {
          return [
            new PhaseChangeEvent(
              config,
              combatEvent.timestamp - fight.start_time - 1,
              config.name,
              !collapsed
            )
          ];
        } else {
          return [];
        }
      }

      return combatEvents.map(
        x =>
          new PhaseChangeEvent(
            config,
            x.timestamp - fight.start_time - 1,
            config.name,
            !collapsed
          )
      );
    }
  }

  private getDebuffEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): DebuffEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DebuffEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name === x.ability.name &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getDebuffStackEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): DebuffStackEvent[] {
    const events = combatEvents
      .map(
        x =>
          new DebuffStackEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            x.stack,
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name === x.ability.name &&
                y.stack === x.stack &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getRemoveDebuffEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): RemoveDebuffEvent[] {
    const events = combatEvents
      .map(
        x =>
          new RemoveDebuffEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly,
            x.x,
            x.y,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            config.showSource,
            new Ability(x.ability),
            combatEvents.filter(
              (y, index, array) =>
                y.ability.name === x.ability.name &&
                array.indexOf(y) < array.indexOf(x)
            ).length + 1
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getInterruptEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): InterruptEvent[] {
    const events = combatEvents
      .map(
        x =>
          new InterruptEvent(
            config,
            x.timestamp - fight.start_time,
            config.friendly || x.sourceIsFriendly,
            x.x,
            x.y,
            config.source
              ? new Actor(config.source)
              : this.getCombatEventSource(x, report),
            new Ability(x.extraAbility),
            combatEvents.filter(
              y =>
                y.extraAbility.name === x.extraAbility.name &&
                y.timestamp < x.timestamp
            ).length + 1,
            config.target
              ? new Actor(config.target)
              : this.getCombatEventTarget(x, report),
            config.showTarget || false
          )
      )
      .filter(
        x =>
          !(
            !config.includePetTargets &&
            x.target &&
            x.target.hasOwnProperty('petOwner')
          )
      );

    return events;
  }

  private getSpawnEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): SpawnEvent[] {
    const events = combatEvents.map(
      (x, index) =>
        new SpawnEvent(
          config,
          x.timestamp - fight.start_time,
          config.friendly,
          x.x,
          x.y,
          new Actor(config.name),
          index + 1
        )
    );

    return events;
  }

  private getDeathEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    deaths: Death[]
  ): DeathEvent[] {
    const events = deaths.map(
      (death, index) =>
        new DeathEvent(
          config,
          index,
          report,
          fight,
          death.timestamp - fight.start_time,
          true,
          this.getFriendly(death.id, report),
          death.events && death.events[0] && death.events[0].ability
            ? new Ability(death.events[0].ability)
            : null,
          death.events &&
          death.events[0] &&
          this.getCombatEventSource(death.events[0], report)
            ? this.getCombatEventSource(death.events[0], report)
            : null,
          death.deathWindow,
          death.damage.total,
          death.healing.total,
          this.getEventsForConfig(
            report,
            fight,
            new EventConfig({ eventType: 'damage' }),
            death.events,
            deaths,
            fight.start_time - death.timestamp,
            true
          )
        )
    );

    return events;
  }

  private getTitleEvents(
    report: Report,
    fight: FightInfo,
    config: EventConfig,
    combatEvents: CombatEvent[]
  ): TitleEvent[] {
    let title = config.title || config.name;

    if (config.timestamps) {
      return config.timestamps
        .filter(timestamp => timestamp < fight.end_time - fight.start_time)
        .map((timestamp, index) => {
          if (config.titles) {
            title = config.titles[index];
          }
          return new TitleEvent(
            timestamp,
            title,
            config.titles ? 0 : index + 1,
            true
          );
        });
    }

    if (
      !config.filter &&
      config.timestamp < fight.end_time - fight.start_time
    ) {
      return [new TitleEvent(config.timestamp, title, 0, true)];
    }

    return combatEvents.map(
      (combatEvent, index) =>
        new TitleEvent(combatEvent.timestamp, title, index + 1, true)
    );
  }

  private getCombatEventSource(event: CombatEvent, report: Report) {
    if (event.sourceIsFriendly) {
      let id = event.sourceID;
      const pet = report.friendlyPets.find(x => x.id === id);
      if (pet) {
        id = pet.petOwner;
      }

      const friendly = JSON.parse(
        JSON.stringify(report.friendlies.find(x => x.id === id) || null)
      );
      if (friendly) {
        friendly.instance = event.sourceInstance;
      }

      return friendly;
    } else {
      const enemy = JSON.parse(
        JSON.stringify(
          report.enemies.find(x => x.id === event.sourceID) || null
        )
      );
      if (enemy) {
        enemy.instance = event.sourceInstance;
      }

      return enemy;
    }
  }

  private getCombatEventTarget(event: CombatEvent, report: Report) {
    if (event.targetIsFriendly) {
      const id = event.targetID;
      const pet = report.friendlyPets.find(x => x.id === id);
      if (pet) {
        return pet;
      }

      return report.friendlies.find(x => x.id === event.targetID);
    } else {
      return report.enemies.find(x => x.id === event.targetID);
    }
  }

  private getFriendly(id: number, report: Report): Actor {
    return report.friendlies.find(x => x.id === id);
  }

  private filterToMatchingCombatEvents(
    config: EventConfig,
    combatEvents: CombatEvent[],
    fight: FightInfo,
    report: Report
  ): CombatEvent[] {
    let matchingCombatEvents: CombatEvent[] = [];
    if (config.filter) {
      matchingCombatEvents = combatEvents.filter(
        this.getFilterExpression(config, fight, report)
      );

      if (config.filter.first && matchingCombatEvents.length > 0) {
        matchingCombatEvents = [matchingCombatEvents[0]];
      }
      if (config.filter.index !== undefined) {
        if (matchingCombatEvents.length > config.filter.index) {
          matchingCombatEvents = [matchingCombatEvents[config.filter.index]];
        } else {
          matchingCombatEvents = [];
        }
      }
      if (
        config.filter.firstPerInstance ||
        config.filter.type === 'firstseen'
      ) {
        matchingCombatEvents = matchingCombatEvents.filter(
          (x, index, array) =>
            array.findIndex(y => y.sourceInstance === x.sourceInstance) ===
            index
        );
      }
      if (config.filter.stack) {
        matchingCombatEvents = matchingCombatEvents.filter(
          x => x.stack === config.filter.stack
        );
      }
      if (config.filter.range && matchingCombatEvents.length > 0) {
        matchingCombatEvents = this.filterToRange(
          config,
          matchingCombatEvents,
          config.filter.range,
          config.filter.minimum
        );
      }
      if (config.filter.rangePerActor && matchingCombatEvents.length > 0) {
        matchingCombatEvents = this.filterToRangePerActor(
          config,
          matchingCombatEvents,
          config.filter.rangePerActor,
          config.filter.minimum
        );
      }
    }

    return matchingCombatEvents;
  }

  private filterToRange(
    config: EventConfig,
    combatEvents: CombatEvent[],
    range: number,
    minimum: number
  ): CombatEvent[] {
    combatEvents = combatEvents.sort((a, b) => a.timestamp - b.timestamp);
    let start = combatEvents[0].timestamp;
    const end = combatEvents[combatEvents.length - 1].timestamp;

    const matchingCombatEventsOnePerRange: CombatEvent[] = [];
    while (start <= end) {
      const eventsInRange = combatEvents.filter(
        x => x.timestamp >= start && x.timestamp <= start + range
      );
      if (
        (minimum && eventsInRange.length < minimum) ||
        eventsInRange.length === 0
      ) {
        start += 500;
        continue;
      }

      if (config.eventType === 'damage') {
        // Sum all damage into first matching damage event and use that
        const totalEvent = eventsInRange.reduce((x, y) => {
          x.amount += y.amount;
          x.absorbed += y.absorbed;
          x.overkill += y.overkill;
          return x;
        });
        matchingCombatEventsOnePerRange.push(totalEvent);
      } else {
        matchingCombatEventsOnePerRange.push(
          eventsInRange.find(x => x.timestamp >= start)
        );
      }

      start =
        matchingCombatEventsOnePerRange[
          matchingCombatEventsOnePerRange.length - 1
        ].timestamp;
      start += range;
    }

    return matchingCombatEventsOnePerRange;
  }

  private filterToRangePerActor(
    config: EventConfig,
    combatEvents: CombatEvent[],
    range: number,
    minimum: number
  ): CombatEvent[] {
    combatEvents = combatEvents.sort((a, b) => a.timestamp - b.timestamp);

    let actorIds = combatEvents.map(x => x.sourceID);
    actorIds.push(...combatEvents.map(x => x.targetID));
    actorIds = actorIds
      .filter((x, index, array) => array.indexOf(x) === index)
      .filter(x => x !== null && x !== undefined);

    const matchingCombatEventsOnePerRangePerActor = actorIds.map(actorId => {
      let start = combatEvents[0].timestamp;
      const end = combatEvents[combatEvents.length - 1].timestamp;

      const matchingCombatEventsOnePerRange: CombatEvent[] = [];
      while (start <= end) {
        const eventsInRange = combatEvents.filter(
          x =>
            (x.targetID === actorId || x.sourceID === actorId) &&
            x.timestamp >= start &&
            x.timestamp <= start + range
        );
        if (
          (minimum && eventsInRange.length < minimum) ||
          eventsInRange.length === 0
        ) {
          start += 500;
          continue;
        }

        if (config.eventType === 'damage') {
          // Sum all damage into first matching damage event and use that
          const totalEvent = eventsInRange.reduce((x, y) => {
            x.amount += y.amount;
            x.absorbed += y.absorbed;
            x.overkill += y.overkill;
            return x;
          });
          matchingCombatEventsOnePerRange.push(totalEvent);
        } else {
          matchingCombatEventsOnePerRange.push(
            eventsInRange.find(x => x.timestamp >= start)
          );
        }

        start =
          matchingCombatEventsOnePerRange[
            matchingCombatEventsOnePerRange.length - 1
          ].timestamp;
        start += range;
      }

      return matchingCombatEventsOnePerRange;
    });

    return [].concat(...matchingCombatEventsOnePerRangePerActor);
  }

  private getFilterExpression(
    config: EventConfig,
    fight: FightInfo,
    report: Report
  ): (
    combatEvent: CombatEvent,
    index: number,
    array: CombatEvent[]
  ) => boolean {
    if (config.filter.type === 'firstseen') {
      const actor = report.enemies.find(x => x.guid === config.filter.actor.id);

      if (!actor) return (combatEvent: CombatEvent) => false;

      return (combatEvent: CombatEvent) =>
        combatEvent.sourceID === actor.id || combatEvent.targetID === actor.id;
    }

    if (config.filter.type === 'percent') {
      const actor = report.enemies.find(x => x.guid === config.filter.actor.id);
      return (combatEvent: CombatEvent) =>
        (combatEvent.type === 'cast' ||
          combatEvent.type === 'applybuff' ||
          combatEvent.type === 'applydebuff') &&
        combatEvent.sourceID === actor.id;
    }

    if (!config.filter.types) {
      config.filter.types = [config.filter.type];
    }
    if (config.filter.ability && !config.filter.ability.ids) {
      config.filter.ability.ids = [config.filter.ability.id];
    }

    if (config.filter.actor) {
      const actor = report.enemies.find(x => x.guid === config.filter.actor.id);

      return (combatEvent: CombatEvent) =>
        (combatEvent.sourceID === actor.id ||
          combatEvent.targetID === actor.id) &&
        config.filter.types.indexOf(combatEvent.type) !== -1 &&
        (config.filter.ability.ids.indexOf(combatEvent.ability.guid) !== -1 ||
          (combatEvent.extraAbility &&
            config.filter.ability.ids.indexOf(combatEvent.extraAbility.guid) !==
              -1));
    }

    return (combatEvent: CombatEvent) =>
      config.filter.types.indexOf(combatEvent.type) !== -1 &&
      (config.filter.ability.ids.indexOf(combatEvent.ability.guid) !== -1 ||
        (combatEvent.extraAbility &&
          config.filter.ability.ids.indexOf(combatEvent.extraAbility.guid) !==
            -1));
  }
}
