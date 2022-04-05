import {UserStoreImpl} from '..';
import {IStore} from '../store';

/**
 * List of all the stores
 */
export enum StoreType {
  USER = 'userStore',
}

export interface Stores extends IStore {
  /**
   * Contains account specific details such as jwt, profile etc.
   */
  userStore: UserStoreImpl;
}

export class StoresImpl implements Stores {
  userStore: UserStoreImpl;

  constructor() {
    this.userStore = new UserStoreImpl();
  }

  resetStore = (): void => {
    // All the stores must be reset here
    this.userStore.resetStore();
  };
}

export const stores: Stores = new StoresImpl();
