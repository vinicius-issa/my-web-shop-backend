import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
import { CryptService } from './crypt.service';
import { JwtService } from './jwt.service';

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
    JwtService,
  ],
  exports: [CryptService, JwtService],
})
export class UtilsModule {}
