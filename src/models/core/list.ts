import _ from 'lodash';

export abstract class List<T> {
  items: any[] = [];

  constructor(dto: any[], type: new (...args: any[]) => T) {
    // Dummy implementation. Replace with your own.
    this.items = _.map(dto, item => new type(item));
  }

  get(): void {}

  add(): void {}

  update(): void {}

  remove(): void {}
}
