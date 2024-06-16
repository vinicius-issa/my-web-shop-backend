import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshPayload, SigninPayload, SigninResponse, SignupPayload } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(@Body() user: SignupPayload) {
    await this.authService.signup(user);
  }

  @Post('signin')
  @HttpCode(200)
  public async signin(
    @Body() credentials: SigninPayload,
  ): Promise<SigninResponse> {
    return this.authService.signin(credentials);
  }

  @Post('refresh')
  @HttpCode(200)
  public async refresh(
    @Body() { token }: RefreshPayload,
  ): Promise<SigninResponse> {
    return this.authService.refresh(token);
  }
}
