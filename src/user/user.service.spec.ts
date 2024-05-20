import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from './dto/user.dto';
import { Role, User } from './model/user.model';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

class UserRepositoryMock {
  public createUser(newUser: CreateUserDTO): Promise<User> {
    return Promise.resolve({
      name: 'UserName',
      role: 'ADMIN' as Role,
      email: 'some-mail',
      password: 'some-password',
    });
  }
}

let userMockRepository: UserRepositoryMock;

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    userMockRepository = new UserRepositoryMock();
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return userMockRepository;
        }
      })
      .compile();

    service = module.get<UserService>(UserService);
  });

  it('should add an Admin user', () => {
    const adminUser: CreateUserDTO = {
      name: 'UserName',
      role: 'ADMIN' as Role,
      email: 'some-mail',
      password: 'some-password',
    };

    const spyRepository = jest.spyOn(userMockRepository, 'createUser');
    service.createUser(adminUser);
    expect(spyRepository).toHaveBeenCalledWith({
      name: 'UserName',
      role: 'ADMIN' as Role,
      email: 'some-mail',
      password: 'some-password',
    });
  });

  it('should add an CLIENT user', () => {
    const adminUser: CreateUserDTO = {
      name: 'UserName',
      email: 'some-mail',
      password: 'some-password',
    };

    const spyRepository = jest.spyOn(userMockRepository, 'createUser');
    service.createUser(adminUser);
    expect(spyRepository).toHaveBeenCalledWith({
      name: 'UserName',
      role: 'CLIENT',
      email: 'some-mail',
      password: 'some-password',
    });
  });
});
