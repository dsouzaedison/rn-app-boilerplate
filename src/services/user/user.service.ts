import {User, UserList} from '../../models';
import {ServiceResponse} from '../core/service.response';

export interface UserUpdateParams {
  first_name: string;
  last_name: string;
  age: number;
}

export interface UserFilters {
  age: number;
  count: number;
}

export interface UserService {
  /**
   * Loads a specific user based on id provided
   * @param filters
   */
  getUsers(filters?: Partial<UserFilters>): Promise<ServiceResponse<UserList>>;

  /**
   * Loads a specific user based on id provided
   * @param id User id to load user
   */
  getUser(id: string): Promise<ServiceResponse<User>>;

  /**
   * Add a new user
   * @param user Information that you want to add
   */
  addUser(user: UserUpdateParams): Promise<ServiceResponse<User>>;

  /**
   * Update user information
   * @param id Id of the user you want to update
   * @param user Information that you want to update
   */
  updateUser(
    id: string,
    user: Partial<UserUpdateParams>,
  ): Promise<ServiceResponse<User>>;

  /**
   * Remove user
   * @param id Id of the user you want to remove
   */
  removeUser(id: string): Promise<ServiceResponse<boolean>>;
}
