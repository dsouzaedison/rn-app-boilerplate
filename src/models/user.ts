import {Entity} from './core/entity';
import {UserDto} from './dtos/user.dto';

export class User extends Entity<UserDto> {
  get firstName(): string {
    return this.dto?.first_name ?? '';
  }

  get lastName(): string {
    return this.dto?.last_name ?? '';
  }
}
