import _ from 'lodash';
import {EntityId} from './entity';

type CustomClass<T> = new (...args: any[]) => T;
type Entity<T> = T & {id: EntityId};
type Iterator<T> = (item: T, index: number) => void;

export abstract class EntityList<T extends {id?: EntityId}> {
  readonly items: Array<T & {id: EntityId}>;
  readonly Type: CustomClass<T>;

  static hasDuplicateIds = <X extends {id: EntityId}>(
    items: Array<X>,
  ): boolean => {
    const group = _.groupBy(items, item => item.id);
    return _.some(group, _items => _items.length > 1);
  };

  /**
   * EntityList of items
   * @param rawData Data to be modelled as list items
   * @param Type Class name to instantiate items
   * @param generateId Generates ids automatically for items
   */
  protected constructor(
    rawData: any,
    Type: CustomClass<T>,
    generateId?: boolean,
  ) {
    this.items = [] as Array<Entity<T>>;
    this.Type = Type;

    _.each(rawData, (item: any) => {
      const hasId = !!item.id;

      if (!hasId && !generateId) {
        throw new Error('All the list items must have an unique id');
      }

      const newItem = new Type(item) as Entity<T>;

      if (!hasId) {
        _.set(newItem, 'id', _.uniqueId('list_item_'));
      }

      this.addItem(newItem);
    });

    if (EntityList.hasDuplicateIds(this.items)) {
      throw new Error('EntityList contains duplicate items');
    }
  }

  get size(): number {
    return this.items.length;
  }

  addItem(item: Entity<T>): EntityList<T> {
    if (this.getItemById(item.id)) {
      this.updateItem(item);
    } else {
      this.items.push(item);
    }

    return this;
  }

  addItems(items: Array<Entity<T>>): EntityList<T> {
    _.each(items, item => this.addItem(item));
    return this;
  }

  updateItem(updatedItem: Entity<T>): EntityList<T> {
    if (updatedItem && this.hasItems()) {
      const hasItem = this.getItemById(updatedItem.id);

      if (hasItem) {
        const index = _.findIndex(
          this.items,
          item => item.id === updatedItem.id,
        );
        this.items[index] = updatedItem;
      }
    }

    return this;
  }

  removeItem(id: EntityId): EntityList<T> {
    const deleteIndex = _.findIndex(this.items, item => item.id === id);

    if (deleteIndex >= 0) {
      this.items.splice(deleteIndex, 1);
    }

    return this;
  }

  clear(): EntityList<T> {
    while (this.hasItems()) {
      this.items.pop();
    }

    return this;
  }

  replace(items: Array<Entity<T>>): EntityList<T> {
    this.clear().addItems(items);
    return this;
  }

  merge(list: EntityList<T>): EntityList<T> {
    this.addItems(list.items);
    return this;
  }

  hasItems(): boolean {
    return this.size > 0;
  }

  isEmpty(): boolean {
    return !this.hasItems();
  }

  getIds(): EntityId[] {
    return _.map(this.items, item => item.id);
  }

  getItemById(id: EntityId): T | undefined {
    return _.find(this.items, item => item.id === id);
  }

  first(): T | undefined {
    return _.first(this.items);
  }

  last(): T | undefined {
    return _.last(this.items);
  }

  find(iterator: (item: T) => boolean): T | undefined {
    return _.find(this.items, iterator);
  }

  findIndex(iterator: (item: T) => boolean): number {
    return _.findIndex(this.items, iterator);
  }

  getFilteredList<X extends EntityList<T>>(
    iterator: (item: T) => boolean,
    list: X,
  ): X {
    list.addItems(_.filter(this.items, iterator));
    return list;
  }

  getIndex(id: EntityId): number {
    return _.findIndex(this.items, item => item.id === id);
  }

  reverse(): EntityList<T> {
    this.items.reverse();
    return this;
  }

  map(iterator: Iterator<T>) {
    return _.map(this.items, iterator);
  }

  groupBy(path: string) {
    return _.groupBy(this.items, path);
  }

  sortBy(path: string) {
    this.replace(_.sortBy(this.items, path));
  }
}
