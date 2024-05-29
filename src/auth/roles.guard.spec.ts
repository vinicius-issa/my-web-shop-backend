import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../user/model/user.model';
import { JwtService } from '../utils/jwt.service';
import { RolesGuard } from './roles.guard';

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
}

const createMock = (token?: string) => ({
  switchToHttp: jest.fn().mockReturnValue({
    getRequest: jest.fn().mockReturnValue({
      headers: token ? { authorization: token } : {},
    }),
  }),
  getHandler: () => jest.fn(),
  getClass: () => undefined,
});

describe('RolesGuard', () => {
  let service: RolesGuard;
  let jwtServiceMock: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    jwtServiceMock = new JwtServiceMock() as JwtService;

    reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.CLIENT]),
    } as unknown as Reflector;

    service = new RolesGuard(reflector, jwtServiceMock);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return an unauthorized error', () => {
    const mockContext = createMock() as unknown as ExecutionContext;

    expect(() => {
      service.canActivate(mockContext);
    }).toThrow('Unauthorized');
  });

  it('Should return a Forbiden error if jwt is not valid', () => {
    const mockContext = createMock(
      'Bearer some-token',
    ) as unknown as ExecutionContext;
    jest.spyOn(jwtServiceMock, 'verify').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(() => {
      service.canActivate(mockContext);
    }).toThrow('Forbidden');
  });

  it('Should return a Forbiden error if user has no required role', () => {
    const mockContext = createMock(
      'Bearer some-token',
    ) as unknown as ExecutionContext;

    expect(() => {
      service.canActivate(mockContext);
    }).toThrow('Forbidden');
  });

  it('Should return true is no required roles are necessary', () => {
    const mockContext = createMock(
      'Bearer some-token',
    ) as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(undefined);

    const result = service.canActivate(mockContext);

    expect(result).toBeTruthy();
  });

  it('Should return true is user has permission', () => {
    const mockContext = createMock(
      'Bearer some-token',
    ) as unknown as ExecutionContext;

    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValueOnce(['ADMIN']);

    const result = service.canActivate(mockContext);

    expect(result).toBeTruthy();
  });
});
