import { Controller, Post, Body, Res, HttpStatus, BadRequestException, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.register(createUserDto);
            res.status(HttpStatus.CREATED);
            res.send( { message: 'User registered successfully', user });
        } catch (error) { 
            if (error.message === 'Email already exists') {
                throw new ConflictException('Email is already registered');
            }
            throw new BadRequestException('User registration failed');
        }

    }

    @Post('login')
    async login(@Body() loginDto: LoginDto, @Res() res: Response) {
        try {
            const user = await this.authService.login(loginDto);
            res.status(HttpStatus.OK);
            res.send( { message: 'User logged in successfully', user});
        } catch (error) {
            if (error.message === 'User does not exists') {
                throw new NotFoundException('User is not registered');
            } else if (error.message === 'Invalid password') {
                throw new UnauthorizedException('Invalid password');
            }
            throw new BadRequestException('User login failed');
        }
        
    }
}