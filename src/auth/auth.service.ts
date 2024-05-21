import { Injectable, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptService } from '../utils/crypt.service';
import { SiginPayload, SiginResponse, SignupPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly userService: UserService,
  ) {}

  public async signup(user: SignupPayload) {
    const hash = await this.cryptService.hash(user.password);
    await this.userService.createUser({
      ...user,
      password: hash,
    });
  }

  public async signin({
    email,
    password,
  }: SiginPayload): Promise<SiginResponse> {
    const user = await this.userService.getUserByEmail(email);
    const isPasswordCorrect = await this.cryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new NotFoundException();
    }
    return {
      token: 'wrong-token',
      refreshToken: 'wrong-refresh-token',
    };
  }
}
