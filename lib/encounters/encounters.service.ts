import { Encounter } from '../encounters/encounter';

export class EncountersService {
  constructor() {}

  getEncounters(): Encounter[] {
    return [
      new Encounter(2032, 'Goroth'),
      new Encounter(2048, 'Demonic Inquisition'),
      new Encounter(2036, 'Harjatan'),
      new Encounter(2037, "Mistress Sassz'ine"),
      new Encounter(2050, 'Sisters of the Moon'),
      new Encounter(2054, 'The Desolate Host'),
      new Encounter(2052, 'Maiden of Vigilance'),
      new Encounter(2038, 'Fallen Avatar'),
      new Encounter(2051, "Kil'jaeden"),
      new Encounter(2076, 'Garothi Worldbreaker'),
      new Encounter(2074, 'Felhounds of Sargeras'),
      new Encounter(2070, 'Antoran High Command'),
      new Encounter(2075, 'Eonar the Life-Binder'),
      new Encounter(2075, 'The Defense of Eonar'),
      new Encounter(2064, 'Portal Keeper Hasabel'),
      new Encounter(2082, 'Imonar the Soulhunter'),
      new Encounter(2088, "Kin'garoth"),
      new Encounter(2069, 'Varimathras'),
      new Encounter(2073, 'The Coven of Shivarra'),
      new Encounter(2063, 'Aggramar'),
      new Encounter(2092, 'Argus the Unmaker')
    ];
  }

  getEncounter(id: number): Encounter {
    return this.getEncounters().find(x => x.id === id);
  }
}
