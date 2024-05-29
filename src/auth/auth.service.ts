import { Injectable, NotFoundException } from '@nestjs/common';
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
    const user = await this.userService.getUserByEmail(email);
    const isPasswordCorrect = await this.cryptService.compare(
      password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new NotFoundException();
    }
    const token = this.jwtService.sign({ email, role: user.role });
    const refreshToken = this.jwtService.signRefreshToken({
      email,
      role: user.role,
    });

    return {
      type: this.TYPE,
      token,
      refreshToken,
    };
  }
}
