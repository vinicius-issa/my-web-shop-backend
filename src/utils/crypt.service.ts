import { Inject, Injectable } from '@nestjs/common';
import { BCRYPT_SALT } from './constants';
import * as bcryp from 'bcrypt'
@Injectable()
export class CryptService {
    constructor(
        @Inject('BCrypt') private bcrypt: typeof bcryp,
    ){}
    private readonly SALT = BCRYPT_SALT;

    public hash(password: string): Promise<string> {
        return this.bcrypt.hash(password, this.SALT);
    }

    public compare(password: string, hash:string): Promise<boolean> {
        return this.bcrypt.compare(password, hash)
    }
}
