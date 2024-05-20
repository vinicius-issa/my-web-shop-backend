import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

class AuthServiceMock {
  signup() {
    return Promise.resolve();
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
});
