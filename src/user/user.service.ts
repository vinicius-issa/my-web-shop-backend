import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/user.dto';
import { Role, User } from './model/user.model';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public createUser(newUser: CreateUserDTO): Promise<User> {
    return this.userRepository.createUser({
      ...newUser,
      role: newUser.role || Role.CLIENT,
    });
  }
}
