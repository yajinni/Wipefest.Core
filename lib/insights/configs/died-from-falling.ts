import { Death } from '../configs/death';

export class DiedFromFalling extends Death {
  constructor(
    id: string,
    boss: number,
    insightTemplate: string = null,
    detailsTemplate: string = null,
    tipTemplate: string = null
  ) {
    super(id, boss, [3], insightTemplate, detailsTemplate, tipTemplate);

    if (insightTemplate === null)
      this.insightTemplate =
        '{totalFrequency} player{plural} fell to their death{plural}.';
  }
}
