export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export interface User {
  email: string;
  password: string;
  name: string;
  role: Role;
}
