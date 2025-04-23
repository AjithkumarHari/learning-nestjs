import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtGlobalModule } from 'src/common/jwt/jwt.module';
import { OtpModule } from 'src/common/otp/otp.module';
import { EmailModule } from 'src/common/email/email.module';

@Module({
    imports: [
        UsersModule,
        JwtGlobalModule,
        OtpModule,
        EmailModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }