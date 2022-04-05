import {UserFilters, UserService, UserUpdateParams} from './user.service';
import {ApiServiceImpl} from '../core/api/api.service.impl';
import {StoreType} from '../../stores';
import {ServiceResponse} from '../core/service.response';
import {User, UserList} from '../../models';
import {UserDto, UsersDto} from '../../models/dtos/user.dto';

export class UserServiceImpl extends ApiServiceImpl implements UserService {
  constructor() {
    super(StoreType.USER);
  }

  // CRUD: CREATE
  async addUser(user: UserUpdateParams): Promise<ServiceResponse<User>> {
    try {
      const response = await this.post<UserDto>(
        this.getEndpoints().users,
        user,
      );

      if (response.data) {
        const newUser = new User(response.data);
        return this.success<User>(newUser);
      }

      return this.error<User>(response);
    } catch (e) {
      return this.error<User>(e);
    }
  }

  // CRUD: READ
  async getUser(id: string): Promise<ServiceResponse<User>> {
    try {
      const response = await this.get<UserDto>(
        `${this.getEndpoints().users}/${id}`,
      );

      if (response.data) {
        const newUser = new User(response.data);
        return this.success<User>(newUser);
      }

      return this.error<User>(response);
    } catch (e) {
      return this.error<User>(e);
    }
  }

  // CRUD: READ LIST / FILTER
  async getUsers(
    filters?: Partial<UserFilters>,
  ): Promise<ServiceResponse<UserList>> {
    try {
      const response = await this.get<UsersDto>(
        this.getEndpoints().users,
        filters,
      );

      if (response.data) {
        const users = new UserList(response.data);
        return this.success<UserList>(users);
      }

      return this.error<UserList>(response);
    } catch (e) {
      return this.error<UserList>(e);
    }
  }

  // CRUD: UPDATE
  async updateUser(
    id: string,
    user: Partial<UserUpdateParams>,
  ): Promise<ServiceResponse<User>> {
    try {
      const response = await this.patch<UserDto>(
        `${this.getEndpoints().users}/${id}`,
        user,
      );

      if (response.data) {
        const newUser = new User(response.data);
        return this.success<User>(newUser);
      }

      return this.error<User>(response);
    } catch (e) {
      return this.error<User>(e);
    }
  }

  // CRUD: DELETE
  async removeUser(id: string): Promise<ServiceResponse<boolean>> {
    try {
      const response = await this.delete<boolean>(
        `${this.getEndpoints().users}/${id}`,
      );

      if (response.data) {
        return this.success<boolean>(response.data);
      }

      return this.error<boolean>(response);
    } catch (e) {
      return this.error<boolean>(e);
    }
  }
}
