import { Role } from '../model/user.model';

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}
