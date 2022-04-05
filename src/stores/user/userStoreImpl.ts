import {action, makeObservable, observable} from 'mobx';
import {User, UserList} from '../../models';
import {UserStore} from './user.store';
import {StoreImpl} from '../store/store.impl';

export class UserStoreImpl extends StoreImpl implements UserStore {
  userList = new UserList();
  user: User | null = null;
  token: string = '';

  constructor() {
    super();

    makeObservable(this, {
      user: observable,
      setUser: action,
    });
  }

  async resetStore() {
    this.user = null;
  }

  getToken(): string {
    return 'jwt_token_received_from_server';
  }

  getUser(): User | null {
    return this.user;
  }

  setUser(user: User): void {
    this.user = user;
  }
}
