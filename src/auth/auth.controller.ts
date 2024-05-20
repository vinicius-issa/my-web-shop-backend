import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupPayload } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  public async signup(@Body() user: SignupPayload) {
    await this.authService.signup(user);
  }
}
