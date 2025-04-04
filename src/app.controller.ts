import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('addUser')
  create( @Body() addNewUserData, @Res() res: Response): any {
    console.log('addNewUserData', addNewUserData);
    res.status(HttpStatus.CREATED).send(this.appService.createUser());
  }
}
