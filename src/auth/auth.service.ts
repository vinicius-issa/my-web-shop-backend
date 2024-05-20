import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CryptService } from '../utils/crypt.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly cryptService: CryptService,
    private readonly userService: UserService,
  ) {}

  public async signup(user: SignupPayload) {
    console.log('AQUI');
    const hash = await this.cryptService.hash(user.password);
    console.log('AQUI');
    await this.userService.createUser({
      ...user,
      password: hash,
    });
  }
}
