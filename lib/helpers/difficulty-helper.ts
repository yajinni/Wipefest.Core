export namespace Difficulty {
  export function ToString(difficulty: number) {
    switch (difficulty) {
      case 5:
        return 'Mythic';
      case 4:
        return 'Heroic';
      case 3:
        return 'Normal';
      default:
        return 'Unknown';
    }
  }
}
