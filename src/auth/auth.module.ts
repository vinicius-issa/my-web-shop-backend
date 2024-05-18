import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [UserModule, UtilsModule],
  providers: [AuthService],
})
export class AuthModule {}
