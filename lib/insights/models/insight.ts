export class Insight {
  constructor(
    public id: string,
    public boss: number,
    private _title: string = '',
    private _details: string = '',
    private _tip: string = '',
    public major: boolean
  ) {}

  get title(): string {
    return this._title;
  }

  get details(): string {
    if (this._details === null) return null;

    const trimmedDetails = this._details
      .split('\r')
      .join('')
      .split('\n')
      .join('')
      .trim();

    return trimmedDetails === '.' || trimmedDetails === ''
      ? null
      : this._details;
  }

  get tip(): string {
    if (this._tip === null) return null;

    const trimmedTip = this._tip
      .split('\r')
      .join('')
      .split('\n')
      .join('')
      .trim();

    return trimmedTip === '.' || trimmedTip === '' ? null : this._tip;
  }

  toJSON(): any {
    return {
      id: this.id,
      boss: this.boss,
      title: this.title,
      details: this.details,
      tip: this.tip,
      major: this.major
    };
  }
}
