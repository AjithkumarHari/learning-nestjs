import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post('create')
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            console.log('addNewUserData', createUserDto);
            const user = await this.usersService.createUser(createUserDto);
            res.status(HttpStatus.CREATED);
            res.send( { message: 'User registered successfully', user });
        } catch (error) {
            console.log('ERROR->', error);   
            if (error.message === 'Email already exists') {
                throw new BadRequestException('Email is already registered');
            }
            throw new BadRequestException('User registration failed');
        }

    }
}