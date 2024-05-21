import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from '../config/mongo-in-memory';
import { CreateUserDTO } from './dto/user.dto';
import { Role } from './model/user.model';
import { UserSchema, UserSchemaDefinition } from './schema/user.schema';
import { UserRepository } from './user.repository';

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

  afterAll(() => {
    return closeInMongodConnection();
  });

  describe('createUser', () => {
    it('should return the new user', async () => {
      const newUser: CreateUserDTO = {
        email: 'mail@test.com',
        name: 'Test User',
        password: 'my-hard-pass',
        role: 'ADMIN' as Role,
      };

      const savedUser = await service.createUser(newUser);

      return expect(savedUser).toMatchObject(newUser);
    });
  });

  describe('getUserByEmail', () => {
    const userTest = {
      email: 'test@get.user',
      name: 'get user',
      password: 'some-password',
      role: Role.CLIENT,
    };

    beforeEach(() => {
      return service.createUser(userTest);
    });

    it('should return the correct User', async () => {
      const user = await service.getUserByEmail('test@get.user');

      expect(user).toMatchObject(userTest);
    });

    it('should throw if user not exist', async () => {
      const user = service.getUserByEmail('no-exist@get.user');

      expect(user).rejects.toThrow('Not Found');
    });
  });
});
