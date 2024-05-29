import { IsEmail, IsNotEmpty } from 'class-validator';

export class SignupPayload {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SigninPayload {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class SigninResponse {
  type: string;
  token: string;
  refreshToken: string;
}
