import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { CryptService } from '../utils/crypt.service';
import { JwtService } from '../utils/jwt.service';
import { SigninPayload, SigninResponse, SignupPayload } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly TYPE = 'Bearer';

  constructor(
    private readonly cryptService: CryptService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
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
  }: SigninPayload): Promise<SigninResponse> {
    let user = await this.getUserOrFail(email);

    const isPasswordCorrect = await this.cryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    return this.getTokens(user);
  }

  private async getUserOrFail(email: string): Promise<User> {
    try {
      const user = await this.userService.getUserByEmail(email);
      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  private getTokens({ email, role }: User): SigninResponse {
    const token = this.jwtService.sign({ email, role });
    const refreshToken = this.jwtService.signRefreshToken({
      email,
      role,
    });

    return {
      type: this.TYPE,
      token,
      refreshToken,
    };
  }
}
