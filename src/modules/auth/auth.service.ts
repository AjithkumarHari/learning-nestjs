import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from 'src/common/jwt/jwt.service';
import { LoginDto } from '../../dto/login.dto';
import { CreateUserDto } from '../../dto/createUser.dto';
import { OtpService } from 'src/common/otp/otp.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtAuthService: JwtAuthService,
        private readonly otpService: OtpService
    ) { }

    async register(registerDto: CreateUserDto): Promise<any> {
        try {
            const user = await this.userService.createUser(registerDto);
            return await this.otpService.sendOtp(user.email, user.name);
        } catch (error) {
            throw error;
        }
    }

    async verifyOTP(otp: string, email: string): Promise<any> {
        try {
            const isOtpVerified = await this.otpService.verifyOtp(email, otp);
            if (!isOtpVerified) {
                throw new Error('Invalid OTP');
            }
            const user = await this.userService.activateUser(email);
            const token = this.jwtAuthService.signToken({ id: user._id, email: user.email });
            await this.otpService.sendSuccessEmail(user.email, user.name);
            return {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    profileImage: user.profileImage
                },
                token: token,
            };
        } catch (error) {
            throw error;
        }
    }

    async resendOtp(email: string): Promise<any> {
        try {
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new Error('Email not found');
            }
            return await this.otpService.sendOtp(user.email, user.name);
        } catch (error) {
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<any> {
        try {
            const { message, existingUser } = await this.userService.validateUser(loginDto.email, loginDto.password);
            const token = this.jwtAuthService.signToken({ id: existingUser._id, email: existingUser.email });
            if (message === 'User not activated') {
                return await this.otpService.sendOtp(existingUser.email, existingUser.name);
            }
            return {
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    profileImage: existingUser.profileImage
                },
                token: token,
            };
        } catch (error) {
            throw error;
        }
    }
}