export class Specialization {
  get icon() {
    return `https://www.warcraftlogs.com/img/icons/${this.className.replace(
      ' ',
      ''
    )}-${this.name.replace(' ', '')}.jpg`;
  }

  get include(): string {
    return `${this.className
      .split(' ')
      .join('-')
      .toLowerCase()}/${this.name
      .split(' ')
      .join('-')
      .toLowerCase()}`;
  }

  get group(): string {
    return `${this.className.substr(0, 2).toUpperCase()}${this.name
      .substr(0, 2)
      .toUpperCase()}`;
  }

  get generalInclude(): string {
    return `${this.className
      .split(' ')
      .join('-')
      .toLowerCase()}/${this.className
      .split(' ')
      .join('-')
      .toLowerCase()}`;
  }

  get generalGroup(): string {
    return `${this.className.substr(0, 4).toUpperCase()}`;
  }

  constructor(
    public id: number,
    public type: string,
    public className: string,
    public name: string,
    public role: string,
    public focusEnabled: boolean = false
  ) {}

  toJSON(): any {
    return Object.assign(
      {
        icon: this.icon,
        include: this.include,
        group: this.group,
        generalInclude: this.generalInclude,
        generalGroup: this.generalGroup
      },
      this
    );
  }
}
