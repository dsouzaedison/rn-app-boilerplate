import {List} from './core/list';
import {User} from './user';
import {UsersDto} from './dtos/user.dto';

export class UserList extends List<User> {
  constructor(dto: UsersDto) {
    super(dto, User);
  }
}
