# Wipefest Core

[![Build Status](https://travis-ci.org/JoshYaxley/Wipefest.Core.svg?branch=master)](https://travis-ci.org/JoshYaxley/Wipefest.Core)

This repository contains the code for the
[@wipefest/core](https://www.npmjs.com/package/@wipefest/core)
NPM package,
responsible for retrieving and processing fight data from
[Warcraft Logs](https://www.warcraftlogs.com),
which powers the
[Wipefest](https://www.wipefest.net)
frontend.

## Contribute

The best way to contribute is to get in touch on our
[Discord server](https://discord.gg/QhE4hfS).

To download the source code and run the tests:

```
git clone https://github.com/JoshYaxley/Wipefest.Core.git
cd Wipefest.Core
npm install
npm test
```

## Install in a project

`npm install @wipefest/core --save-dev`

This library depends on:

* [axios](https://www.npmjs.com/package/axios) for HTTP requests
* [rxjs](https://www.npmjs.com/package/rxjs) for Observables

### Example usage

An example repository that uses this library can be found
[here](https://github.com/JoshYaxley/Wipefest.Core.Examples.TypeScript).

The following code retrieves and processes a fight, before logging it to the console:

``` typescript
// We start off by importing everything we need from the library
import {
  Difficulty,
  EncountersService,
  EventConfigService,
  Fight,
  FightService,
  FightEventService,
  InsightService,
  MarkupParser,
  SpecializationsService,
  WarcraftLogsCombatEventService,
  WarcraftLogsDeathService,
  WarcraftLogsReportService,
  Timestamp
} from '@wipefest/core';
import * as axios from 'axios';
import 'rxjs/add/operator/mergeMap';

// The library needs to make HTTP requests, and it does this using axios
// so we create an axios instance each for the two URLs we will need to send requests to
const warcraftLogsHttp = axios.default.create({
  baseURL: 'https://www.warcraftlogs.com/v1/'
});
const eventConfigHttp = axios.default.create({
  baseURL:
    // The below URL is the event configs location used in production
    // You might want to change it to your own fork if you are testing a change
    'https://raw.githubusercontent.com/JoshYaxley/Wipefest.EventConfigs/master/'
});
// This needs to be your Warcraft Logs Public Key which you can get here:
// https://www.warcraftlogs.com/accounts/changeuser
const apiKey = 'YOUR_WCL_PUBLIC_KEY';

// The library functionality is split into several services.
// Some simply retrieve data (such as WarcraftLogsReportService)
// and some process data (such as InsightService)
// We're going to retrieve and process an entire fight,
// so we pretty much need all of them,
// but there will be use cases where you only need 1 or 2 to do what you need.
const reportService = new WarcraftLogsReportService(warcraftLogsHttp, apiKey);
const deathService = new WarcraftLogsDeathService(warcraftLogsHttp, apiKey);
const encountersService = new EncountersService();
const specializationsService = new SpecializationsService();
const eventConfigService = new EventConfigService(
  encountersService,
  specializationsService,
  eventConfigHttp
);
const combatEventService = new WarcraftLogsCombatEventService(
  eventConfigService,
  warcraftLogsHttp,
  apiKey
);
const fightEventService = new FightEventService();
const insightService = new InsightService();

const fightService = new FightService(
  deathService,
  combatEventService,
  fightEventService,
  specializationsService,
  insightService
);

// Firstly, let's retrieve a report by it's report code
reportService.getReport('yxW1hraPm9NfgcDR').subscribe(report => {
  // The EncountersService contains the encounters that Wipefest supports
  // We can find which fights in the report are supported
  const supportedFights = report.fights.filter(fight =>
    encountersService
      .getEncounters()
      .some(encounter => encounter.id === fight.boss)
  );

  // Let's pick a fight to load and process
  const fightInfo = supportedFights[3];

  eventConfigService
    // Grab the file names of the event config files for this boss from index.json
    .getIncludesForBoss(fightInfo.boss)
    // Load the event configs from the files (as well as the 'general/raid' file)
    .flatMap(bossIncludes => eventConfigService.getEventConfigs(['general/raid'].concat(bossIncludes)))
    // Process the fight using the FightService, this will:
    // - Retrieve combat events and deaths
    // - Process fight events
    // - Process insights
    .flatMap(eventConfigs => fightService.getFight(report, fightInfo, eventConfigs))
    // Log the output using the function that we've defined below
    .subscribe(fight => logFight(fight));
});

// This function lets us log the important data from the fight to the console
// FightEvent and Insight titles are returned in a markup language
// (e.g. "{[style="fire"] Chaos Pulse}")
// which Wipefest renders to HTML on the web using MarkupParser.
// We also use MarkupParser here but pass in MarkupParser.RuleSets.plainText
// to parse the titles in a format readable on the command line
function logFight(fight: Fight) {
  console.log(`${Difficulty.ToString(fight.info.difficulty)} ${fight.info.name}`.toUpperCase());
  longLineBreak();

  console.log('INSIGHTS');
  longLineBreak();

  fight.insights.forEach(insight =>
    console.log(
      `- ${MarkupParser.Parse(insight.title, MarkupParser.RuleSets.plainText)}`
    )
  );
  longLineBreak();

  console.log('TIMELINE');
  fight.events.filter(event => event.config.show).forEach(event => {
    if (event.config.eventType === 'phase') {
      shortLineBreak();
      console.log(event.title.toUpperCase());
      shortLineBreak();
    } else {
      console.log(
        `${Timestamp.ToMinutesAndSeconds(
          event.timestamp
        )} - ${MarkupParser.Parse(
          event.tableTitle,
          MarkupParser.RuleSets.plainText
        )}`
      );
    }
  });
}

function longLineBreak() {
  console.log('------------------------------------------');
}

function shortLineBreak() {
  console.log('----------------');
}
```

The resulting output should look like:

![](https://i.imgur.com/MfBVodN.png)

## Linting

Lint with `npm run lint`

Fix lint with `npm run lint-fix`

`tslint.json` based off of [Airbnb](https://github.com/excelmicro/typescript/blob/master/linters/tslint.json)

Combined with [Prettier](https://github.com/prettier/prettier) via [tslint-plugin-prettier](https://github.com/ikatyang/tslint-plugin-prettier)