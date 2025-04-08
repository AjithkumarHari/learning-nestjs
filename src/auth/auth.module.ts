import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtGlobalModule } from 'src/common/jwt/jwt.module';

@Module({
    imports: [
        UsersModule,
        JwtGlobalModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }