import { Controller, Post, Body, Res, HttpStatus, BadRequestException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../../dto/login.dto';
import { CreateUserDto } from '../../dto/createUser.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('register')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(createUserDto);
            res.status(HttpStatus.CREATED);
            res.send({ message: 'User registered successfully', ...user });
        } catch (error) {
            if (error.message === 'Email already exists') {
                throw new ConflictException(error.message);
            }
            throw new BadRequestException('User registration failed');
        }
    }

    @Post('verify-otp')
    async verifyOtp(@Body() otpDto: { otp: string, email: string }, @Res() res: Response) {
        try {
            const user = await this.authService.verifyOTP(otpDto.otp, otpDto.email);
            res.status(HttpStatus.OK);
            res.send({ message: 'OTP verified successfully', ...user });
        } catch (error) {
            if (error.message === 'Invalid OTP') {
                throw new BadRequestException(error.message);
            }
            throw new BadRequestException('OTP verification failed');
        }
    }

    @Post('resend-otp')
    async resendOtp(@Body() emailDto: { email: string }, @Res() res: Response) {
        try {
            const otp = await this.authService.resendOtp(emailDto.email);
            res.status(HttpStatus.OK);
            res.send({ message: 'OTP resent successfully', otp });
        } catch (error) {
            if (error.message === 'Email not found') {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Failed to resend OTP');
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(loginDto);
            res.status(HttpStatus.OK);
            res.send({ message: 'User logged in successfully', ...user });
        } catch (error) {
            if (error.message === 'User does not exists') {
                throw new NotFoundException(error.message);
            } else if (error.message === 'Invalid password') {
                throw new UnauthorizedException(error.message);
            }
            throw new BadRequestException('User login failed');
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() emailDto: { email: string }, @Res() res: Response) {
        try {
            const response = await this.authService.forgotPassword(emailDto.email);
            res.status(HttpStatus.OK);
            res.send({ message: 'Password reset link sent successfully', ...response });
        } catch (error) {
            if (error.message === 'Email not found') {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Failed to send password reset link');
        }
    }
}