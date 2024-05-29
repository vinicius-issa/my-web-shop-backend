import { Inject, Injectable } from '@nestjs/common';
import * as bcryp from 'bcrypt';
import { BCRYPT_SALT } from './constants';
@Injectable()
export class CryptService {
  constructor(@Inject('BCrypt') private bcrypt: typeof bcryp) {}
  private readonly SALT = BCRYPT_SALT;

  public async hash(password: string): Promise<string> {
    const hash = await bcryp.hash(password, this.SALT);
    return hash;
  }

  public async compare(password: string, hash: string): Promise<boolean> {
    try {
      const result = await this.bcrypt.compare(password, hash);
      return result;
    } catch (e) {
      console.log(e);
    }
  }
}
