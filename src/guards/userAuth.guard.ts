import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthService } from 'src/common/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtAuthService: JwtAuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const { headers } = context.switchToHttp().getRequest<Request>();

            const token = headers.authorization?.split(' ')[1];

            if (!token) return false;

            return this.jwtAuthService.verifyToken(token);

        } catch (error) {
            console.error('Token verification failed:', error.message);
            return false;
        }
    }
}