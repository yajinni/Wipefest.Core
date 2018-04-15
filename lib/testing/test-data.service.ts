import { Report, FightInfo } from '../reports/report';
import { EventConfig, EventConfigIndex } from '../event-configs/event-config';
import { CombatEvent } from '../combat-events/combat-event';
import { Raid, Player } from '../raid/raid';
import { FightEvent } from '../fight-events/models/fight-event';
import { Insight } from '../insights/models/insight';
import { Death } from '../deaths/death';
import { Ability } from '../fight-events/models/ability-event';
import { Specialization } from '../specializations/specialization';
import { CombatEventPage } from '../warcraft-logs/warcraft-logs-combat-event.service';
import { FightEventDto } from 'fight-events/models/fight-event-dto';

export class TestDataService {
  get(fileName: string): TestData {
    const files = [
      {
        name: 'xyMd2kwb3W9zNrJF-13',
        // tslint:disable-next-line:no-require-imports
        contents: require(`./data/xyMd2kwb3W9zNrJF-13`)
      }
    ];

    const json = files.find(x => x.name === fileName).contents.data;

    const data = Object.create(TestData.prototype);
    Object.assign(data, json);

    data.report = Object.create(Report.prototype);
    Object.assign(data.report, json.report);

    data.fightInfo = Object.create(FightInfo.prototype);
    Object.assign(data.fightInfo, json.fightInfo);

    data.deaths = Object.create(TestDataDeaths.prototype);
    Object.assign(data.deaths, json.deaths);
    data.deaths.entries = json.deaths.entries.map(x => {
      const death = Object.create(Death.prototype);
      Object.assign(death, x);
      return death;
    });

    data.eventConfigIndex = json.eventConfigIndex.map(x => {
      const eventConfigIndex = Object.create(EventConfigIndex.prototype);
      Object.assign(eventConfigIndex, x);
      return eventConfigIndex;
    })

    data.eventConfigs = json.eventConfigs.map(x => {
      const eventConfig = Object.create(EventConfig.prototype);
      Object.assign(eventConfig, x);
      return eventConfig;
    });

    data.combatEventPages = json.combatEventPages.map(x => {
      const page = Object.create(CombatEventPage.prototype);
      Object.assign(page, x);
      page.events = x.events.map(y => {
        const combatEvent = Object.create(CombatEvent.prototype);
        Object.assign(combatEvent, y);
        return y;
      });
      return page;
    });

    data.raid = Object.create(Raid.prototype);
    Object.assign(data.raid, json.raid);
    data.raid.players = json.raid.players.map(x => {
      const player = Object.create(Player.prototype);
      Object.assign(player, x);
      if (player.specialization) {
        player.specialization = Object.create(Specialization.prototype);
        Object.assign(player.specialization, x.specialization);
      }
      return player;
    });

    data.events = json.events.map(x => {
      const event = Object.create(FightEvent.prototype);
      Object.assign(event, x);
      if (event.hasOwnProperty('ability')) {
        event.ability = Object.create(Ability.prototype);
        Object.assign(event.ability, x.ability);
      }
      return event;
    });

    data.insights = json.insights.map(x => {
      const insight = Object.create(Insight.prototype);
      Object.assign(insight, x);
      return insight;
    });

    return data;
  }
}

export class TestData {
  report: Report;
  fightInfo: FightInfo;
  deaths: TestDataDeaths;
  eventConfigIndex: EventConfigIndex[];
  eventConfigs: EventConfig[];
  query: string;
  combatEventPages: CombatEventPage[];
  get combatEvents(): CombatEvent[] {
    return [].concat.apply([], this.combatEventPages.map(x => x.events));
  }
  raid: Raid;
  events: FightEvent[];
  eventDtos: FightEventDto[];
  insights: Insight[];
}

export class TestDataDeaths {
  entries: Death[];
}
