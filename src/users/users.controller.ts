import { Controller, Post, Body, Res, HttpStatus, BadRequestException, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/userAuth.guard';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('allUsers')
    @UseGuards(AuthGuard)
    async getAllUsers(@Res() res: Response) {
        try {
            const users = await this.usersService.getAllUsers();
            res.status(HttpStatus.OK).send(users);
        } catch (error) {
            throw new BadRequestException('Failed to fetch users');
        }
    }
    
}