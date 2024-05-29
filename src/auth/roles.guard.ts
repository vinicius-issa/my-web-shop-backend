import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from '../user/model/user.model';
import { JwtService } from '../utils/jwt.service';
import { ROLES_KEY } from './roles.decorator';

type AuthHeader = Headers & {
  authorization?: string;
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    let email: string, role: Role;

    try {
      const user = this.jwtService.verify(token);
      email = user.email;
      role = user.role;
    } catch {
      throw new ForbiddenException();
    }

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new ForbiddenException();
    }

    request['user'] = {
      email,
      role,
    };

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as AuthHeader).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
