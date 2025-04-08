import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthService } from 'src/common/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtAuthService: JwtAuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();

        const authHeader = request.headers['authorization'];

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return false;
        }

        const token = authHeader.split(' ')[1];

        try {
            const decodedToken = this.jwtAuthService.verifyToken(token);
            if (!decodedToken) {
                return false;
            }
            return true;
        } catch (error) {
            console.error('Token verification failed:', error.message);
            return false;
        }
    }
}