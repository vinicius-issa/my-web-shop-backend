import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { CryptService } from './crypt.service';

@Module({
  providers: [
    CryptService,
    {
      provide: 'BCrypt',
      useValue: bcrypt,
    },
    {
      provide: 'JsonWebToken',
      useValue: jsonwebtoken,
    },
  ],
  exports: [CryptService],
})
export class UtilsModule {}
