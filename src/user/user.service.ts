import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './model/user.model';
import { UserSchemaDefinition } from './schema/user.schema';
import { UserRepository } from './user.repository';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
}

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  public createUser(newUser: CreateUserDTO): Promise<User> {
    return this.userRepository.createUser({
      ...newUser,
      role: newUser.role || 'CLIENT',
    });
  }
}
