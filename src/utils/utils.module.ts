import { Module } from '@nestjs/common';
import { CryptService } from './crypt.service';
import * as bcrypt from 'bcrypt'

@Module({
  providers: [
    CryptService,
    {
      provide: 'BCrypt',
      useValue: bcrypt
    }
  ],
  exports: [CryptService]
})
export class UtilsModule {}
