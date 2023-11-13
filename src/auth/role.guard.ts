import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
    ) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.get<string>('role', context.getHandler());

        if (!requiredRole) {
            return true;
        }

        const request = context.switchToHttp().getRequest();

        if (request.user.role !== requiredRole) {
            return false;
        }

        return true; // user has the required role.
    }
}
