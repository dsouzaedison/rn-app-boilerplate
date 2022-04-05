import {EntityId} from './entity-list';
import {Model} from './model';

export abstract class LocalEntity<
  T extends Record<string, any>,
> extends Model<T> {
  _id!: EntityId;

  protected constructor(dto: T) {
    super(dto);
  }

  get id() {
    return this._id;
  }
}
