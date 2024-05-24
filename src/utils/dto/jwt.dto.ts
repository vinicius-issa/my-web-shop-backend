import { Role } from '../../user/model/user.model';

export interface JwtPayload {
  email: string;
  role: Role;
}
