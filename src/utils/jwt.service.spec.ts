import { Test, TestingModule } from '@nestjs/testing';

import { Role } from '../user/model/user.model';
import { JwtService } from './jwt.service';

class JsonWebTokenMock {
  sign() {
    return 'some-jwt-token';
  }
  verify() {
    return {
      email: 'user@mail.com',
      role: Role.ADMIN,
    };
  }
  signRefreshToken() {
    return 'some-jwt-token';
  }
  verifyRefreshToken() {
    return {
      email: 'user@mail.com',
      role: Role.ADMIN,
    };
  }
}

describe('JwtService', () => {
  let service: JwtService;
  let jsonWebToken: JsonWebTokenMock;

  beforeEach(async () => {
    jsonWebToken = new JsonWebTokenMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtService,

        {
          provide: 'JsonWebToken',
          useValue: jsonWebToken,
        },
      ],
    }).compile();

    service = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signin', () => {
    const payload = {
      email: 'some-email',
      role: Role.ADMIN,
    };

    it('shoud call jsonWebToken sign with correct params', () => {
      const spySignin = jest.spyOn(jsonWebToken, 'sign');

      service.sign(payload);

      expect(spySignin).toHaveBeenCalledWith(payload, 'some-key', {
        expiresIn: 86400,
      });
    });

    it('shoud return a valid token', () => {
      const token = service.sign(payload);

      expect(token).toEqual('some-jwt-token');
    });
  });

  describe('verify', () => {
    it('shoud call jsonWebToken verify with correct params', () => {
      const spyVerify = jest.spyOn(jsonWebToken, 'verify');

      service.verify('some-token');

      expect(spyVerify).toHaveBeenCalledWith('some-token', 'some-key');
    });

    it('shoud return a valid token', () => {
      const payload = service.verify('some-token');

      expect(payload).toEqual({
        email: 'user@mail.com',
        role: Role.ADMIN,
      });
    });
  });

  describe('signinRefreshToken', () => {
    const payload = {
      email: 'some-email',
      role: Role.ADMIN,
    };

    it('shoud call jsonWebToken sign with correct params', () => {
      const spySignin = jest.spyOn(jsonWebToken, 'sign');

      service.signRefreshToken(payload);

      expect(spySignin).toHaveBeenCalledWith(payload, 'some-key', {
        expiresIn: 604800,
      });
    });

    it('shoud return a valid token', () => {
      const token = service.signRefreshToken(payload);

      expect(token).toEqual('some-jwt-token');
    });
  });

  describe('verify', () => {
    it('shoud call jsonWebToken verify with correct params', () => {
      const spyVerify = jest.spyOn(jsonWebToken, 'verify');

      service.verifyRefreshToken('some-token');

      expect(spyVerify).toHaveBeenCalledWith('some-token', 'some-key');
    });

    it('shoud return a valid token', () => {
      const payload = service.verifyRefreshToken('some-token');

      expect(payload).toEqual({
        email: 'user@mail.com',
        role: Role.ADMIN,
      });
    });
  });
});
