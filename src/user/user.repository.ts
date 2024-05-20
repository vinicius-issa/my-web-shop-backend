import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDTO } from './dto/user.dto';
import { User } from './model/user.model';
import { UserSchemaDefinition } from './schema/user.schema';

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
