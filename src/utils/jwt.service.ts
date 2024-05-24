import { Inject, Injectable } from '@nestjs/common';
import jsonwebtoken from 'jsonwebtoken';
import {
  JWT_EXP_TIME,
  JWT_KEY,
  JWT_REFRESH_EXP_TIME,
  JWT_REFRESH_KEY,
} from './constants';
import { JwtPayload } from './dto/jwt.dto';

@Injectable()
export class JwtService {
  constructor(@Inject('JsonWebToken') private jwt: typeof jsonwebtoken) {}

  public sign(payload: JwtPayload): string {
    return this.jwt.sign(payload, JWT_KEY, { expiresIn: JWT_EXP_TIME });
  }

  public verify(token: string): JwtPayload {
    const payload = this.jwt.verify(token, JWT_KEY);
    return payload as JwtPayload;
  }

  public signRefreshToken(payload: JwtPayload): string {
    return this.jwt.sign(payload, JWT_REFRESH_KEY, {
      expiresIn: JWT_REFRESH_EXP_TIME,
    });
  }

  public verifyRefreshToken(token: string): JwtPayload {
    const payload = this.jwt.verify(token, JWT_REFRESH_KEY);
    return payload as JwtPayload;
  }
}
