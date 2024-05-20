import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema, UserSchemaDefinition } from './schema/user.schema';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [],
  providers: [UserService, UserRepository],
  imports: [
    MongooseModule.forFeature([
      { name: UserSchemaDefinition.name, schema: UserSchema },
    ]),
  ],
  exports: [UserService],
})
export class UserModule {}
