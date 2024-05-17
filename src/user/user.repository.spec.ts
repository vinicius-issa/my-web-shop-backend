import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from './user.repository';
import { rootMongooseTestModule } from '../config/mongo-in-memory';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaDefinition, UserSchema } from './schema/user.schema';
import { CreateUserDTO } from './user.service';

describe('UserRepository', () => {
  let service: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature(),
        MongooseModule.forFeature([
          { name: UserSchemaDefinition.name, schema: UserSchema },
        ]),
      ],
      providers: [UserRepository],
    }).compile();

    service = module.get<UserRepository>(UserRepository);
  });

  it('should return the new user', async () => {
    const newUser: CreateUserDTO = {
      email: 'mail@test.com',
      name: 'Test User',
      password: 'my-hard-pass',
      role: 'ADMIN',
    };

    const savedUser = await service.createUser(newUser);

    return expect(savedUser).toMatchObject(newUser);
  });
});
