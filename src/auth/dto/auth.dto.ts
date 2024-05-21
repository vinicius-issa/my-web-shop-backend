import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupPayload {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SiginPayload {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SiginResponse {
  token: string;
  refreshToken: string;
}
