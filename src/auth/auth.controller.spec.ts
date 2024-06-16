import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SigninResponse } from './dto/auth.dto';

class AuthServiceMock {
  signup() {
    return Promise.resolve();
  }
  signin(): Promise<SigninResponse> {
    return Promise.resolve({
      type: 'Bearer',
      token: '123-abc',
      refreshToken: '456-def',
    });
  }
  refresh(): Promise<SigninResponse> {
    return Promise.resolve({
      type: 'Bearer',
      token: '123-abc',
      refreshToken: '456-def',
    });
  }
}

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthServiceMock;
  let module: TestingModule;

  beforeEach(async () => {
    authService = new AuthServiceMock();
    module = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return authService;
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call authService signup with correct params', async () => {
    const spySignup = jest.spyOn(authService, 'signup');
    const user = {
      email: 'user@mail.com',
      name: 'User Name',
      password: '123456',
    };
    await controller.signup(user);

    return expect(spySignup).toHaveBeenCalledWith(user);
  });

  it('should call authService signin with correct params', async () => {
    const spySignin = jest.spyOn(authService, 'signin');
    const credentials = {
      email: 'user@mail.com',
      password: '123456',
    };
    await controller.signin(credentials);

    return expect(spySignin).toHaveBeenCalledWith(credentials);
  });

  it('should call authService refresh with correct params', async () => {
    const spyRefresh = jest.spyOn(authService, 'refresh');
    const token = 'Bearer some-refresh-token'
    
    const credentials = {
      token
    };
    await controller.refresh(credentials);

    return expect(spyRefresh).toHaveBeenCalledWith(token);
  });
});
