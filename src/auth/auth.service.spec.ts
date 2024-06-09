import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDTO } from '../user/dto/user.dto';
import { Role } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { CryptService } from '../utils/crypt.service';
import { JwtPayload } from '../utils/dto/jwt.dto';
import { JwtService } from '../utils/jwt.service';
import { AuthService } from './auth.service';

class CryptServiceMock {
  hash(password: string) {
    return Promise.resolve('new-hash');
  }
  compare(password: string, hash: string) {
    return Promise.resolve(true);
  }
}

class UserServiceMock {
  createUser(user: CreateUserDTO) {
    return Promise.resolve({
      email: 'user@test.com',
      password: 'hash-pasword',
      name: 'User Test',
      role: Role.CLIENT,
    });
  }

  getUserByEmail(email: string) {
    return Promise.resolve({
      email: 'user@test.com',
      password: 'hash-pasword',
      name: 'User Test',
      role: Role.CLIENT,
    });
  }
}

class JwtServiceMock {
  public sign(payload: JwtPayload): string {
    return 'some-jwt';
  }

  public verify(token: string): JwtPayload {
    return {
      email: 'user@mail.com',
      role: Role.ADMIN,
    };
  }

  public signRefreshToken(payload: JwtPayload): string {
    return 'some-refresh-jwt';
  }

  public verifyRefreshToken(token: string): JwtPayload {
    return {
      email: 'user@mail.com',
      role: Role.ADMIN,
    };
  }
}

describe('AuthService', () => {
  let service: AuthService;
  let cryptServiceMock: CryptServiceMock;
  let userServiceMock: UserServiceMock;
  let jwtServiceMock: JwtServiceMock;

  const newUserMock = {
    name: 'New User',
    password: '123456',
    email: 'user@test.com',
  };

  beforeEach(async () => {
    cryptServiceMock = new CryptServiceMock();
    userServiceMock = new UserServiceMock();
    jwtServiceMock = new JwtServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === CryptService) {
          return cryptServiceMock;
        }
        if (token === UserService) {
          return userServiceMock;
        }
        if (token === JwtService) {
          return jwtServiceMock;
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should call crypt hash with user password', async () => {
      const spyCrypt = jest.spyOn(cryptServiceMock, 'hash');

      await service.signup(newUserMock);

      return expect(spyCrypt).toHaveBeenCalledWith('123456');
    });

    it('should call user service with user and hash password', async () => {
      const spyCrypt = jest.spyOn(userServiceMock, 'createUser');

      await service.signup(newUserMock);

      return expect(spyCrypt).toHaveBeenCalledWith({
        name: 'New User',
        password: 'new-hash',
        email: 'user@test.com',
      });
    });
  });

  describe('signin', () => {
    const email = 'user@test.com';
    const password = '123456';

    it('Should get user with correct email', async () => {
      const spyGetUser = jest.spyOn(userServiceMock, 'getUserByEmail');
      await service.signin({ email, password });

      expect(spyGetUser).toHaveBeenCalledWith(email);
    });

    it('Should throw Unhauthorized error if getUserByEmail throw', async () => {
      jest
        .spyOn(userServiceMock, 'getUserByEmail')
        .mockImplementationOnce(async () => {
          throw new Error('Not Found');
        });

      expect(service.signin({ email, password })).rejects.toThrow(
        'Unauthorized',
      );
    });

    it('Should call cryptService compare with correct params', async () => {
      const spyCompare = jest.spyOn(cryptServiceMock, 'compare');
      await service.signin({ email, password });

      expect(spyCompare).toHaveBeenCalledWith(password, 'hash-pasword');
    });

    it('Should throw NotFound if password is not correct', async () => {
      jest.spyOn(cryptServiceMock, 'compare').mockResolvedValueOnce(false);

      expect(service.signin({ email, password })).rejects.toThrow(
        'Unauthorized',
      );
    });

    it('Should call jwtServiceSign with correct params', async () => {
      const spySign = jest.spyOn(jwtServiceMock, 'sign');

      await service.signin({ email, password });

      expect(spySign).toHaveBeenCalledWith({ email, role: Role.CLIENT });
    });

    it('Should call jwtServiceSignRefreshToken with correct params', async () => {
      const spySign = jest.spyOn(jwtServiceMock, 'signRefreshToken');

      await service.signin({ email, password });

      expect(spySign).toHaveBeenCalledWith({ email, role: Role.CLIENT });
    });

    it('Should return the correct values', async () => {
      const response = await service.signin({ email, password });

      expect(response).toEqual({
        type: 'Bearer',
        token: 'some-jwt',
        refreshToken: 'some-refresh-jwt',
      });
    });
  });
});
