import { Controller, Post, Body, Res, HttpStatus, BadRequestException, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('allUsers')
    async getAllUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.getAllUsers();
            res.status(HttpStatus.OK).send(users);
        } catch (error) {
            throw new BadRequestException('Failed to fetch users');
        }
    }
    
}