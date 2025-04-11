import { Controller, Body, Res, HttpStatus, BadRequestException, Get, UseGuards, Put, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { Response } from 'express';
import { AuthGuard } from 'src/guards/userAuth.guard';
import { UpdateUserDto } from 'src/dto/updateUser.dto';


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

    @Put('update/:id')
    @UseGuards(AuthGuard)
    async updateUser(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
        @Res() res: Response) {
        try {
            const user = await this.usersService.updateUser(id, updateUserDto);
            res.status(HttpStatus.OK);
            res.send({ message: 'User updated successfully', user });
        } catch (error) {
            if (error.message === 'User not found') {
                throw new NotFoundException(error.message);
            }
            throw new BadRequestException('Failed to update user');
        }
    }
}