import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupPayload {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}
