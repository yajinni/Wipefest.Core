export namespace MarkupParser {
  export class Tag {
    constructor(
      public tag: string,
      public properties: Property[],
      public text: string
    ) {}
  }

  export class Rule {
    constructor(
      public propertyName: string,
      public template: string,
      public propertyValueTransform: (value: string) => string = x => x,
      public tagTextTransform: (text: string) => string = x => x
    ) {}
  }

  export class Property {
    constructor(public name: string, public value: string) {}
  }

  export namespace RuleSets {
    export const html = [
      new Rule(
        'url',
        `<a href="$0" target="_blank" rel="noopener noreferrer">$1</a>`
      ),
      new Rule('style', `<span class="$0">$1</span>`, style =>
        style
          .split(' ')
          .map(s => `markup-${s}`)
          .join(' ')
      ),
      new Rule('image', `<img src="$0" alt="$1" />`)
    ];

    export const plainText = [
      new Rule('url', '$1'),
      new Rule('style', '$1'),
      new Rule('image', '')
    ];
  }

  /*
  Example A: {[style="bold"] text} => <span class="markup-bold">text</span>
  Example B: {[url="http://google.com" style="bold no-underline"] text} => <span class="markup-bold markup-no-underline"><a href="http://google.com" target="_blank" rel="noopener noreferrer">text</a></span>
  */
  export function Parse(input: string, rules: Rule[] = []): string {
    if (input === undefined || input === null || input.trim() === "") return input;

    if (rules.length === 0) {
      rules = RuleSets.html;
    }

    const tags = getMatches(input, /{\[(.+?)] (.+?)}/g).map(t => {
      const properties = getMatches(t[1], /([^ ]+?)=("|')(.+?)("|')/g).map(
        p => new Property(p[1], p[3])
      );

      return new Tag(t[0], properties, t[2]);
    });

    tags.forEach(tag => {
      input = input.replace(tag.tag, parseTag(tag, rules));
    });

    while (input.indexOf('  ') !== -1) {
      input = input.replace('  ', ' ');
    }

    return input;
  }

  function getMatches(input: string, regex: RegExp): string[][] {
    const matches: string[][] = [];

    let result;
    while ((result = regex.exec(input)) != null) {
      if (result.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      matches.push(result);
    }

    return matches;
  }

  function parseTag(tag: Tag, rules: Rule[]) {
    return applyProperties(tag.text, tag.properties, rules);
  }

  function applyProperties(
    input: string,
    properties: Property[],
    rules: Rule[]
  ): string {
    properties.forEach(
      property =>
        (input = applyProperty(
          input,
          property,
          rules.find(x => x.propertyName === property.name)
        ))
    );

    return input;
  }

  function applyProperty(
    input: string,
    property: Property,
    rule: Rule
  ): string {
    return rule.template
      .replace('$0', rule.propertyValueTransform(property.value))
      .replace('$1', rule.tagTextTransform(input));
  }
}
