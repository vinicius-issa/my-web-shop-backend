import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserSchemaDefinition } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDTO } from './user.service';
import { User } from './model/user.model';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(UserSchemaDefinition.name) private userModel: Model<User>,
  ) {}

  public async createUser(newUser: CreateUserDTO): Promise<User> {
    const createdUser = new this.userModel(newUser);

    return createdUser.save();
  }
}
