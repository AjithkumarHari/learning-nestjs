import { Controller, Post, Body, Res, HttpStatus, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {

    }
    
}