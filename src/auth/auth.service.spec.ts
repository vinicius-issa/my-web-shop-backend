import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/user/model/user.model';
import { UserRepository } from 'src/user/user.repository';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

const userServiceMock: UserRepository = {
  createUser: () =>
    Promise.resolve({
      name: 'New User',
      email: 'user@mail.com',
      password: 'some-password',
      role: 'CLIENT' as Role,
    }),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === UserService) {
          return userServiceMock;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
