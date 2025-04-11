import { Module } from '@nestjs/common';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthGuard } from 'src/guards/userAuth.guard';
import { JwtAuthService } from './jwt.service';

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                secret: config.get<string>('JWT_SECRET_KEY'),
                signOptions: { expiresIn: config.get<string>('JWT_EXPIRES_IN') },
            }),
            inject: [ConfigService],
        }),
    ],
    providers: [
        AuthGuard,
        JwtAuthService
    ],
    exports: [
        NestJwtModule,
        AuthGuard,
        JwtAuthService
    ],
})
export class JwtGlobalModule { }
