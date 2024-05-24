import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { JwtService } from '../utils/jwt.service';
import { UtilsModule } from '../utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UserModule, UtilsModule],
  providers: [AuthService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
