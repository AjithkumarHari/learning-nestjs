import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
    constructor(private readonly jwtService: JwtService) { }

    signToken(payload: object): string {
        try {
            return this.jwtService.sign(payload);
        } catch (error) {
            throw new Error('Failed to sign token');
        }
    }

    verifyToken(token: string): any {
        try {
            return this.jwtService.decode(token);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}