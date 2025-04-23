import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthService } from 'src/common/jwt/jwt.service';
import { LoginDto } from '../../dto/login.dto';
import { CreateUserDto } from '../../dto/createUser.dto';
import { OtpService } from 'src/common/otp/otp.service';
import { EmailService } from 'src/common/email/email.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtAuthService: JwtAuthService,
        private readonly otpService: OtpService,
        private readonly emailService: EmailService,
    ) { }

    async register(registerDto: CreateUserDto): Promise<any> {
        try {
            const user = await this.userService.createUser(registerDto);
            if (!user) {
                throw new Error('User registration failed');
            }
            const otp = await this.otpService.createOtp(user.email);
            return await this.emailService.sendEmail(user.email, 'otp', { name: user.name, otp });
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
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new Error('User not found');
            }
            if (!user?.isActive) {
                await this.userService.activateUser(email);
                await this.emailService.sendEmail(user.email, 'signup_success', { name: user.name });
            }
            const token = this.jwtAuthService.signToken({ id: user._id, email: user.email });
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
            const otp = await this.otpService.createOtp(user.email);
            return await this.emailService.sendEmail(user.email, 'otp', { name: user.name, otp });
        } catch (error) {
            throw error;
        }
    }

    async login(loginDto: LoginDto): Promise<any> {
        try {
            const { message, existingUser } = await this.userService.validateUser(loginDto.email, loginDto.password);
            const token = this.jwtAuthService.signToken({ id: existingUser._id, email: existingUser.email });
            if (message === 'User not activated') {
                const otp = await this.otpService.createOtp(existingUser.email);
                return await this.emailService.sendEmail(existingUser.email, 'otp', { name: existingUser.name, otp });
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

    async forgotPassword(email: string): Promise<any> {
        try {
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                throw new Error('Email not found');
            }
            const token = await this.jwtAuthService.signToken({ id: user._id, email: user.email });
            await this.otpService.createOtp(user.email, token);
            const resetLink = `${process.env.ORIGIN_PORT}/auth/reset-password?email=${encodeURIComponent(email)}&token=${token}`;
            console.log("reset link", resetLink);
            return await this.emailService.sendEmail(user.email, 'forgot_password', { name: user.name, link: resetLink });
        } catch (error) {
            console.log("error form auth service", error);
            throw error;
        }
    }
}