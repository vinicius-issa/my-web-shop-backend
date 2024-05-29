import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UtilsModule } from '../utils/utils.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [UserModule, UtilsModule],
  providers: [AuthService, RolesGuard],
  controllers: [AuthController],
  exports: [RolesGuard],
})
export class AuthModule {}
