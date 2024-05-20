import { Inject, Injectable } from '@nestjs/common';
import * as bcryp from 'bcrypt';
import { BCRYPT_SALT } from './constants';
@Injectable()
export class CryptService {
  constructor(@Inject('BCrypt') private bcrypt: typeof bcryp) {}
  private readonly SALT = BCRYPT_SALT;

  public async hash(password: string): Promise<string> {
    console.log('HASH', this.SALT);
    const hash = await bcryp.hash(password, this.SALT);
    console.log('HASH', hash);
    return hash;
  }

  public compare(password: string, hash: string): Promise<boolean> {
    return this.bcrypt.compare(password, hash);
  }
}
