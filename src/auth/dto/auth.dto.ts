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
  type: string;
  token: string;
  refreshToken: string;
}
