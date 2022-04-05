import {StoreImpl} from '../store/store.impl';
import {IStore} from '../store';
import {User} from '../../models';

export interface UserStore extends StoreImpl, IStore {
  getUser(): User | null;
  setUser(user: User): void;
}
